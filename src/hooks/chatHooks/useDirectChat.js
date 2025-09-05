import supabase from '../../database/dbInit';
import { useEffect, useRef, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendNotifications } from '../../lib/notifications';

export function useDirectChat({ topic, meId, peerId }) {

  const channelRef = useRef(null);
  const insertSubRef = useRef(null);
  const updateSubRef = useRef(null);
  const msgsRef = useRef(null);

  const [status, setStatus] = useState('connecting');
  const [insertSubStatus, setInsertSubStatus] = useState('connecting')
  const [updateSubStatus, setUpdateSubStatus] = useState('connecting')
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const sendMessage = useCallback(
    async ({ text, toUser, user_notification_token }) => {
      if (!text?.trim()) return;

      const peerOnline = onlineUsers.includes(peerId)

      const tempId = uuidv4();
      const optimisticMessage = {
        id: tempId,
        from_user: meId,
        to_user: toUser,
        message: text.trim(),
        created_at: new Date().toISOString(),
        delivered_at: null,
        read_at: null,
        pending: true,
        failed: false,
      };

      const realMessage = {
        ...optimisticMessage,
        channel_id: topic
      }

      delete realMessage.pending
      delete realMessage.failed

      // Optimistic UI update
      setMessages((prev) => [...prev, optimisticMessage]);

      let attempts = 0;
      const maxAttempts = 2;
      let inserted = false;

      while (attempts < maxAttempts && !inserted) {
        attempts++;
        const { error } = await supabase.from('admin_mothers_chat').insert(realMessage);
        if (!error) inserted = true;

        else{
          console.log("ERROR ON COUNT", attempts, error)
        }
      }

      if (!inserted) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...msg, pending: false, failed: true } : msg
          )
        );
      
      } else{
        if(!peerOnline){
          await sendNotifications({
              tokens: [user_notification_token],
              // sound: null,
              title: `Incoming message from lavendercare healthcare admin`,
              body: `${text}`,
              data: {}
          });          
        } 

        channelRef.current?.send({
          type: 'broadcast',
          event: 'sendMsg',
          payload: realMessage
        })        
      }
    },
    [meId, topic]
  );

  // mark a message as delivered
  const messageDelivered = async (messageId, read_at) => {
    const { data, error } = await supabase
      .from("admin_mothers_chat")
      .update({ delivered_at: new Date().toISOString() })
      .eq("id", messageId)
      .select('*')
      .single();

    if (error) {
      console.error("msgDelivered error:", error);
      return null;
    }

    const payload = {
      ...data
    }

    if(read_at){
      payload.read_at = read_at
    }

    channelRef.current?.send({
      type: 'broadcast',
      event: 'messageDelivered',
      payload
    })       

    return payload; // updated message
  }

  // mark a message as read
  const messageRead = async (messageId) => {
    const { data, error } = await supabase
      .from("admin_mothers_chat")
      .update({ read_at: new Date().toISOString() })
      .eq("id", messageId)
      .select()
      .single();

    if (error) {
      console.error("msgRead error:", error);
      return null;
    }

    channelRef.current?.send({
      type: 'broadcast',
      event: 'messageRead',
      payload: data
    })         

    return data; // updated message
  }

  const onMsgReceived = (msg) => {
    if(msg?.to_user === meId){

        const msgId = msg?.id
        const msgDelivered = messages.find(m => (m?.id == msgId) && m?.delivered_at)  
        
        if(!msgDelivered){
          messageDelivered(msg?.id, msg?.read_at)
        }
    }    
  }  

  const onMsgRead = (msg) => {
    if(msg?.to_user === meId){

      const msgId = msg?.id
      const msgRead = messages.find(m => (m?.id == msgId) && m?.read_at)

      if(!msgRead){
        messageRead(msg?.id)
      }
    }
  }  

  const onMsgsLoaded = (by_id, timestamp) => {
    if(by_id == meId && msgsRef.current?.length > 0) return 

    console.log("Messages loaded by other user")

    //all msgs sent to "by_id" that aren't read/delivered are now read/delivered at timestamp  

    const updatedMsgs = [...msgsRef.current];

    for (let i = 0; i < updatedMsgs.length; i++) {
      const msg = updatedMsgs[i];
      if (msg.to_user === by_id && (!msg.delivered_at || !msg.read_at)) {
        updatedMsgs[i] = {
          ...msg,
          delivered_at: msg.delivered_at || timestamp,
          read_at: msg.read_at || timestamp
        };
      }
    }     

    setMessages(dedupeMessages(updatedMsgs))
  }

  // helper: dedupe messages by id
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
      // Replace optimistic message
      const updated = [...msgs];
      updated[idx] = { ...newMsg, pending: false, failed: false };
      return updated;
    }

    const replacedMsgs =  [...msgs, { ...newMsg, pending: false, failed: false }];    

    return dedupeMessages(replacedMsgs)
  }

  const loadMessages = async ({ msgLoadedTimeStamp }) => {
    const { data, error } = await supabase
      .rpc('mark_and_get_admin_mother_messages', {
        ad_channel_id: topic,
        ad_user_id: meId,
        ad_timestamp: msgLoadedTimeStamp
      });

    if (!error) {
      setMessages((prev) => dedupeMessages([...(prev || []), ...(data || [])]));     
      return
    }

    console.log(error)
  };  
  
  useEffect(() => {
    msgsRef.current = messages
  }, [messages])  

  useEffect(() => {
    if (!topic || !meId) return;

    setStatus('connecting');
    setInsertSubStatus('connecting');
    setUpdateSubStatus('connecting')

    const msgLoadedTimeStamp = new Date().toISOString()
    
    loadMessages({ msgLoadedTimeStamp })

    // Presence channel setup remains the same
    const channel = supabase.channel(topic, {
      config: { broadcast: { self: true, ack: true }, presence: { key: meId } },
    });   

    channel.on('broadcast', { event: 'sendMsg' }, (payload) => {
      const msg = payload.payload

      setMessages((prev) => replaceOptimisticMessages(prev || [], msg));

      onMsgReceived(msg)
    })    

    channel.on('broadcast', { event: 'messageRead' }, (payload) => {
      const msg = payload.payload

      setMessages((prev) => replaceOptimisticMessages(prev || [], msg));
    }) 
    
    channel.on('broadcast', { event: 'messageDelivered' }, (payload) => {
      const msg = payload.payload

      setMessages((prev) => replaceOptimisticMessages(prev || [], msg));

      onMsgRead(msg)
    }) 
    
    channel.on('broadcast', { event: 'messagesLoaded' }, (payload) => {
      const { by_id, timestamp } = payload.payload
      
      onMsgsLoaded(by_id, timestamp)
    })      

    // Presence event handlers (join, leave, sync) unchanged
    channel.on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState();
      const users = Object.keys(presenceState).map((key) => key);
      setOnlineUsers(users);
    });
    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      setOnlineUsers((prev) => {
        if (prev.includes(key)) return prev;
        return [...prev, key];
      });
    });
    channel.on('presence', { event: 'leave' }, ({ key }) => {
      setOnlineUsers((prev) => prev.filter((u) => u !== key));
    });

    channel.subscribe(async (subStatus) => {
      if (subStatus === 'SUBSCRIBED') {
        setStatus('subscribed');

        channel.send({
          type: 'broadcast',
          event: 'messagesLoaded',
          payload: {
            by_id: meId,
            timestamp: msgLoadedTimeStamp
          }
        })         

        await channel.track({ online_at: new Date().toISOString() }); 
      } else if (subStatus === 'CLOSED' || subStatus === 'CHANNEL_ERROR') {
        setStatus('error');
      }
    });

    channelRef.current = channel;      

    // New: Subscribe to realtime admin_mothers_chat table changes filtered by channel_id
    const insertSubscription = supabase
      .channel('realtime-bookings-chats-insert')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_mothers_chat',
          filter: `channel_id=eq.${topic}`,
        },
        (payload) => {
          const newMsg = payload.new;
          // console.log(newMsg)
          setMessages((prev) => replaceOptimisticMessages(prev || [], newMsg));

          onMsgReceived(newMsg)
        }
      )
      .subscribe(status => {
        console.log("Insert Real-Time status", status)
        if(status === 'SUBSCRIBED'){
          setInsertSubStatus('subscribed');
          return
        }

        setInsertSubStatus('error');
      });

    const updateSubscription = supabase
      .channel('realtime-bookings-chats-update')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'admin_mothers_chat',
          filter: `channel_id=eq.${topic}`,
        },
        (payload) => {
          const newMsg = payload.new;
          // console.log(newMsg)
          setMessages((prev) => replaceOptimisticMessages(prev || [], newMsg));

          onMsgRead(newMsg)
        }
      )
      .subscribe(status => {
        console.log("Update Real-Time status", status)
        if(status === 'SUBSCRIBED'){
          setUpdateSubStatus('subscribed');
          return
        }

        setUpdateSubStatus('error');
      });      

    insertSubRef.current = insertSubscription;
    updateSubRef.current = updateSubscription;

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(insertSubscription);
      supabase.removeChannel(updateSubscription)
      channelRef.current = null;
      insertSubRef.current = null;
      updateSubRef.current = null;
      setMessages([]);
      setOnlineUsers([]);
    };
  }, [topic, meId]);

  return {
    sendMessage,
    messages,
    status,
    insertSubStatus,
    updateSubStatus,
    onlineUsers,
  };
}
