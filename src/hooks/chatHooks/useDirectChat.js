import supabase from '../../database/dbInit';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { appLoadStart, appLoadStop } from '../../redux/slices/appLoadingSlice';
import { getMessages, setChannelIds } from '../../redux/slices/messagesSlice';
import { toast } from 'react-toastify';
import { sendNotifications } from '../../lib/notifications';

const notifyMother = async ({ msg, mother }) => {
  try {

    let token = mother?.notification_token
    const mother_id = mother?.id

    if (!token) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('notification_token')
        .eq('id', mother_id)
        .single()

      if (error) {
        console.log(error)
        return
      }

      if (data) {
        token = data?.notification_token
      }
    }

    if (!token) {
      return
    }

    return await sendNotifications({
      tokens: [token],
      // sound: null,
      title: `Care-Coordinator Message`,
      body: msg,
      data: {
        notification_type: "care-coordinator-chat"
      }
    });


  } catch (error) {
    console.log(error)
    // toast.error("Error notifying mother. Messages have been sent though, she can view them on her lavendercare app")
  }
}

export function useDirectChat({ topic, meId, peerId, dbChannelId: providedDbChannelId, isAdmin = true, isCommunity = false }) {
  // console.log("DEBUG: useDirectChat hook called with:", { topic, meId, peerId });
  const dispatch = useDispatch();

  // 1. Database ID must be a UUID.
  const dbChannelId = providedDbChannelId || peerId;

  // 2. Realtime Topic can be a string with a prefix to avoid intertwining broadcasts across apps.
  const realtimeTopic = topic;

  const channelRef = useRef(null);
  const msgsRef = useRef(null)

  const savedMsgs = useSelector(state => getMessages(state).channelIds[topic])

  const [status, setStatus] = useState('connecting');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [canLoadMoreMsgs, setCanLoadMoreMsgs] = useState(true)

  const tableName = isCommunity ? 'community_chat' : isAdmin ? 'admin_mothers_chat' : 'bookings_chats'
  const rpcName = isCommunity ? 'fetch_and_mark_community_chat_messages' : isAdmin ? 'mark_and_get_admin_mother_messages' : 'fetch_and_mark_booking_chat_messages'

  const sendTempMedia = useCallback(({ file_type, text, duration, toUser }) => {
    try {
      const msg = text
      if (!msg || !file_type) return;

      const tempId = uuidv4();
      const optimisticMessage = {
        id: tempId,
        from_user: meId,
        message: msg,
        created_at: new Date().toISOString(),
        delivered_at: null,
        read_at: null,
        pending: true,
        failed: false,
        file_type,
        duration: duration ?? null
      };

      if (!isCommunity) {
        optimisticMessage.to_user = toUser
      }

      setMessages((prev) => [...prev, optimisticMessage]);
      return optimisticMessage
    } catch (error) {
      console.log(error)
      toast.error("Sending error")
    }
  }, [meId, topic])

  const updateTempMedia = useCallback(async ({ from_type, msgId, failed, msgObj, user_profile, bookingId, channel_id, community_id }) => {
    try {
      if (!msgObj) return;

      if (failed) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === msgId ? { ...msg, pending: false, failed: true } : msg
          )
        );
      } else {
        const msgObjClone = { ...msgObj }
        if (isCommunity) {
          msgObjClone.from_type = from_type || 'admin'
        }

        setMessages(prev => prev?.map(msg => {
          if (msg?.id === msgId) {
            return msgObjClone
          }
          return msg
        }))

        const realMessage = { ...msgObjClone }
        const dbIdKey = isCommunity ? 'community_id' : isAdmin ? 'channel_id' : 'booking_id';
        realMessage[dbIdKey] = dbChannelId;

        delete realMessage.pending
        delete realMessage.failed

        let inserted = false
        const { error } = await supabase.from(tableName).insert(realMessage);
        if (!error) inserted = true;
        else {
          console.log(error)
        }

        if (!inserted) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === msgId ? { ...msg, pending: false, failed: true } : msg
            )
          );
        } else {
          channelRef.current?.send({
            type: 'broadcast',
            event: 'sendMsg',
            payload: user_profile ? { ...realMessage, user_profile } : realMessage
          })

          if (!isCommunity) {
            notifyMother({
              msg: 'Sent a media file',
              mother: user_profile
            })
          }
        }
      }
    } catch (error) {
      console.log(error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === msgId ? { ...msg, pending: false, failed: true } : msg
        )
      );
      toast.error("Sending error")
    }
  }, [meId, topic, tableName, isAdmin, isCommunity])

  const deleteMessage = async ({ msgId, msg }) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", msgId)

      if (error) {
        console.log(error)
        throw new Error()
      }

      const deletedMsg = {
        id: msgId, from_user: msg?.from_user, created_at: msg?.created_at
      }

      setMessages(prev => prev?.map(msg => msg?.id === msgId ? deletedMsg : msg))

      channelRef.current?.send({
        type: 'broadcast',
        event: 'updateMsg',
        payload: deletedMsg
      })

      return true

    } catch (error) {
      console.log(error)
      toast.error('Cant seem to delete messages at this time')
    }
  }

  const retrySend = useCallback(({ msgId }) => {
    setMessages(prev => prev?.map(msg => {
      if (msg?.id === msgId) {
        return { ...msg, pending: true, failed: false }
      }
      return msg
    }))
  }, [meId, topic])

  const cancelRetrySend = useCallback(({ msgId }) => {
    setMessages(prev => prev?.map(msg => {
      if (msg?.id === msgId) {
        return { ...msg, pending: false, failed: true }
      }
      return msg
    }))
  }, [meId, topic])

  const sendMessage = useCallback(
    async ({ from_type, text, fileType, toUser, bookingId, channel_id, community_id, user_profile, duration, oldMsgId }) => {
      const file_type = fileType || 'text'
      try {
        const msg = text
        if (!msg) return;

        const tempId = uuidv4();
        const optimisticMessage = {
          id: tempId,
          from_user: meId,
          message: msg,
          created_at: new Date().toISOString(),
          delivered_at: null,
          read_at: null,
          pending: true,
          failed: false,
          file_type,
          duration: duration ?? null
        };

        if (!isCommunity) {
          optimisticMessage.to_user = toUser
        }

        if (isCommunity) {
          optimisticMessage.from_type = from_type || 'admin'
        }

        const dbIdKey = isCommunity ? 'community_id' : isAdmin ? 'channel_id' : 'booking_id';
        const realMessage = {
          ...optimisticMessage,
          [dbIdKey]: dbChannelId
        }

        delete realMessage.pending
        delete realMessage.failed

        setMessages((prev) => [...prev, optimisticMessage]);

        let attempts = 0;
        const maxAttempts = 2;
        let inserted = false;

        while (attempts < maxAttempts && !inserted) {
          attempts++;
          const { error } = await supabase.from(tableName).insert(realMessage);
          if (!error) inserted = true;
          else {
            console.log("ERROR ON COUNT", attempts, error)
          }
        }

        if (!inserted) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId ? { ...msg, pending: false, failed: true } : msg
            )
          );
        } else {
          channelRef.current?.send({
            type: 'broadcast',
            event: 'sendMsg',
            payload: user_profile ? { ...realMessage, user_profile } : realMessage
          })

          if (!isCommunity) {
            notifyMother({
              msg: file_type === 'text' ? msg : 'Sent a voice note',
              mother: user_profile
            })
          }
        }
      } catch (error) {
        console.log(error)
        toast.error('Error sending chat message')
      } finally {
        if (oldMsgId) {
          deleteMessage({ msgId: oldMsgId })
        }
      }
    },
    [meId, topic, tableName, isAdmin, isCommunity, dbChannelId]
  );

  const messageDelivered = async (messageId, read_at) => {
    const { data, error } = await supabase
      .from(tableName)
      .update({ delivered_at: new Date().toISOString() })
      .eq("id", messageId)
      .select()
      .maybeSingle();

    if (error || !data) {
      console.error("msgDelivered error:", error);
      return null;
    }

    const payload = { ...data }
    if (read_at) {
      payload.read_at = read_at
    }

    channelRef.current?.send({
      type: 'broadcast',
      event: 'messageDelivered',
      payload
    })
    return payload;
  }

  const messageRead = async (messageId) => {
    const { data, error } = await supabase
      .from(tableName)
      .update({ read_at: new Date().toISOString() })
      .eq("id", messageId)
      .select()
      .maybeSingle();

    if (error || !data) {
      console.error("msgRead error:", error);
      return null;
    }

    channelRef.current?.send({
      type: 'broadcast',
      event: 'messageRead',
      payload: data
    })
    return data;
  }

  const bulkMsgsRead = async (msgsIds) => {
    const read_at = new Date().toISOString()

    // 1. Immediately update local state to prevent the UI useEffect from re-triggering mark-as-read
    setMessages(prev => markMessagesRead(prev || [], msgsIds, read_at));

    const { data, error } = await supabase
      .from(tableName)
      .update({ read_at })
      .in("id", msgsIds)
      .select("id")

    if (error) {
      console.error("bulkMsgsRead error:", error);
      return null;
    }

    channelRef.current?.send({
      type: 'broadcast',
      event: 'bulkMsgsRead',
      payload: { msgsIds, read_at }
    })
    return data;
  }

  const onMsgReceived = useCallback((msg) => {
    if (msg?.to_user === meId) {
      const msgId = msg?.id
      // Use ref to avoid dependency on messages state
      const alreadyDelivered = msgsRef.current?.find(m => (m?.id == msgId) && m?.delivered_at)
      if (!alreadyDelivered) {
        messageDelivered(msg?.id, msg?.read_at)
      }
    }
  }, [meId]) // Removed messages dependency

  const onMsgRead = useCallback((msg) => {
    if (msg?.to_user === meId) {
      const msgId = msg?.id
      // Use ref to avoid dependency on messages state
      const alreadyRead = msgsRef.current?.find(m => (m?.id == msgId) && m?.read_at)
      if (!alreadyRead) {
        messageRead(msg?.id)
      }
    }
  }, [meId]) // Removed messages dependency

  const onMsgsLoaded = useCallback((by_id, timestamp) => {
    if (by_id === meId) return;
    setMessages(prev => {
      const updated = prev.map(msg => {
        if (msg.to_user === by_id && (!msg.delivered_at || !msg.read_at)) {
          return {
            ...msg,
            delivered_at: msg.delivered_at || timestamp,
            read_at: msg.read_at || timestamp
          };
        }
        return msg;
      });
      return dedupeMessages(updated);
    });
  }, [meId])

  const dedupeMessages = (msgs) => {
    const seen = new Set();
    return msgs.filter((msg) => {
      if (seen.has(msg.id)) return false;
      seen.add(msg.id);
      return true;
    });
  };

  const replaceOptimisticMessages = (msgs, newMsg) => {
    const idx = msgs.findIndex((msg) => msg.id === newMsg.id);
    if (idx !== -1) {
      const updated = [...msgs];
      updated[idx] = { ...newMsg, pending: false, failed: false };
      return updated;
    }
    return dedupeMessages([...msgs, { ...newMsg, pending: false, failed: false }]);
  }

  const markMessagesRead = (msgs, ids, readAt) => {
    if (!ids?.length) return msgs;
    const idSet = new Set(ids);
    return msgs.map(msg => idSet.has(msg.id) ? { ...msg, read_at: readAt } : msg);
  };

  const loadMessages = useCallback(async ({ msgLoadedTimeStamp, last_loaded_at, isRefreshing = false, isOlder = false }) => {
    if (!dbChannelId) return;

    // Core RPC loading logic only. Redux initial load is handled separately in useEffect.
    const { data, error } = await supabase
      .rpc(rpcName, {
        [isCommunity ? 'c_id' : isAdmin ? 'ad_channel_id' : 'p_booking_id']: dbChannelId,
        [isCommunity ? 'c_user_id' : isAdmin ? 'ad_user_id' : 'p_user_id']: meId,
        [isCommunity ? 'c_timestamp' : isAdmin ? 'ad_timestamp' : 'p_timestamp']: msgLoadedTimeStamp,
        last_loaded_at,
        _limit: 50
      });

    if (!error && data) {
      if (data.length === 0) setCanLoadMoreMsgs(false);
      const normalized = [...data].reverse();
      setMessages(prev => dedupeMessages(isOlder ? [...normalized, ...prev] : [...prev, ...normalized]));
    }
  }, [dbChannelId, meId, rpcName, isCommunity, isAdmin]);

  const setup = useCallback(({ topic, meId, msgLoadedTimeStamp }) => {
    if (channelRef.current) supabase.removeChannel(channelRef.current);

    const channel = supabase.channel(topic, {
      config: { broadcast: { self: true, ack: true }, presence: { key: meId } },
    });

    channel
      .on('broadcast', { event: 'sendMsg' }, (payload) => {
        const msg = payload.payload;
        setMessages((prev) => replaceOptimisticMessages(prev || [], msg));
        onMsgReceived(msg);
      })
      .on('broadcast', { event: 'updateMsg' }, (payload) => {
        const msg = payload.payload;
        setMessages((prev) => replaceOptimisticMessages(prev || [], msg));
      })
      .on('broadcast', { event: 'messageRead' }, (payload) => {
        const msg = payload.payload;
        setMessages((prev) => replaceOptimisticMessages(prev || [], msg));
      })
      .on('broadcast', { event: 'bulkMsgsRead' }, (payload) => {
        const { msgsIds, read_at } = payload.payload;
        setMessages((prev) => markMessagesRead(prev || [], msgsIds, read_at));
      })
      .on('broadcast', { event: 'messageDelivered' }, (payload) => {
        const msg = payload.payload;
        setMessages((prev) => replaceOptimisticMessages(prev || [], msg));
        if (!isAdmin && !isCommunity) onMsgRead(msg);
      })
      .on('broadcast', { event: 'messagesLoaded' }, (payload) => {
        const { by_id, timestamp } = payload.payload;
        onMsgsLoaded(by_id, timestamp);
      })
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        setOnlineUsers(Object.keys(presenceState));
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: tableName,
        filter: isCommunity ? `community_id=eq.${dbChannelId}` : isAdmin ? `channel_id=eq.${dbChannelId}` : `booking_id=eq.${dbChannelId}`,
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newMsg = payload.new;
          setMessages((prev) => replaceOptimisticMessages(prev || [], newMsg));
          onMsgReceived(newMsg);
        } else if (payload.eventType === 'UPDATE') {
          const updatedMsg = payload.new;
          setMessages((prev) => replaceOptimisticMessages(prev || [], updatedMsg));
        } else if (payload.eventType === 'DELETE') {
          setMessages(prev => prev.filter(m => m.id !== payload.old.id));
        }
      })
      .subscribe(async (subStatus) => {
        if (subStatus === 'SUBSCRIBED') {
          setStatus('subscribed');
          channel.send({
            type: 'broadcast',
            event: 'messagesLoaded',
            payload: { by_id: meId, timestamp: msgLoadedTimeStamp }
          });
          await channel.track({ online_at: new Date().toISOString() });
        } else {
          setStatus('error');
        }
      });

    channelRef.current = channel;
  }, [meId, tableName, isAdmin, isCommunity, onMsgReceived, onMsgRead, onMsgsLoaded, dbChannelId]);

  const refreshConnection = () => {
    dispatch(appLoadStart())
    const msgLoadedTimeStamp = new Date().toISOString()
    setup({ topic: realtimeTopic, meId, msgLoadedTimeStamp });
    setTimeout(() => {
      dispatch(appLoadStop())
      loadMessages({ msgLoadedTimeStamp, isRefreshing: true })
    }, 1500)
  };

  // 1. Sync messages state to Redux (Only when messages actually change)
  useEffect(() => {
    if (!messages.length || !realtimeTopic) return;
    const reversed = [...messages]?.reverse()
    msgsRef.current = reversed

    // Deep-ish equality check to avoid Redux sync loop
    const currentSaved = savedMsgs || [];
    const hasLengthChange = currentSaved.length !== reversed.length;
    // Check if the last message metadata changed (like read status)
    const hasMetaChange = reversed.length > 0 && currentSaved.length > 0 &&
      (reversed[0].read_at !== currentSaved[0].read_at ||
        reversed[0].delivered_at !== currentSaved[0].delivered_at);

    if (hasLengthChange || hasMetaChange) {
      dispatch(setChannelIds({ channelId: realtimeTopic, messages: reversed }))
    }
  }, [messages, realtimeTopic, dispatch]); // savedMsgs omitted

  // 2. Main Setup: Runs only on Mount or Topic change
  useEffect(() => {
    if (!realtimeTopic || !meId) return;
    const msgLoadedTimeStamp = new Date().toISOString()

    // Initial data hydration: Priority Redux > RPC
    if (savedMsgs?.length > 0) {
      setMessages(dedupeMessages([...savedMsgs].reverse()));
    } else {
      loadMessages({ msgLoadedTimeStamp });
    }

    setup({ topic: realtimeTopic, meId, msgLoadedTimeStamp });

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      setMessages([]);
      setOnlineUsers([]);
    };
  }, [realtimeTopic, meId, setup]); // loadMessages removed

  return {
    sendMessage,
    messages,
    status,
    onlineUsers,
    bulkMsgsRead,
    refreshConnection,
    retrySend,
    cancelRetrySend,
    loadMessages,
    canLoadMoreMsgs,
    deleteMessage,
    sendTempMedia,
    updateTempMedia
  };
}
