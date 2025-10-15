import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ProfileImg from "../components/ProfileImg";
import Modal from "../components/ui/Modal";
import { getUserDetailsState } from "../../../redux/slices/userDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useDirectChat } from "../../../hooks/chatHooks/useDirectChat";
import { dmTopic } from "../../../hooks/chatHooks/dm";
import { isoToAMPM } from "../../../lib/utils";
import { IoCheckmark, IoCheckmarkDoneSharp } from "react-icons/io5";
import { MdMessage } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";
import { LuMessageCircleWarning, LuRotateCw } from "react-icons/lu";
import { sendNotifications } from "../../../lib/notifications";
import { toast } from "react-toastify";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import supabase from "../../../database/dbInit";
import AudioPlayer from "../../../hooks/chatHooks/voiceNotes/AudioPlayer";

function CommunityChat() {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { state } = useLocation()
    const [searchParams, setSearchParams] = useSearchParams();

    const community_id = searchParams.get("community_id");

    const _community = state?.community

    const profile = useSelector(state => getUserDetailsState(state).profile)

    const bottomRef = useRef(null)
    const topRef = useRef(null)

    const [input, setInput] = useState("");
    const [community, setCommunity] = useState(_community)

    const meId = profile?.id
    const peerId = community?.id
    const topic = community?.id //community_id is the topic!

    const {
        sendMessage, messages, status, insertSubStatus, updateSubStatus, onlineUsers, loadMessages,
        canLoadMoreMsgs, bulkMsgsRead, refreshConnection,
    } = useDirectChat({
        topic,
        meId,
        peerId,
        isCommunity: true,
        isAdmin: false
    })

    const peerOnline = onlineUsers.includes(peerId)

    useEffect(() => {
        if (!community && !community_id) {
            navigate('/admin/communities/all-communities')

        } else {
            if (community_id && !community) {
                fetchCommunity()
            }
        }
    }, [])

    useEffect(() => {
        if (messages?.length > 0) {
            bottomRef?.current?.scrollIntoView({ behaviour: 'smooth' })

            handleReadUnreadMsgs()
        }
    }, [messages]);

    const fetchCommunity = async () => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("communities")
                .select("*")
                .single()
                .eq("id", community_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            setCommunity(data)

        } catch (error) {
            console.log(error)
            navigate('/admin/communities/all-communities')

        } finally {
            dispatch(appLoadStop())
        }
    }

    const handleReadUnreadMsgs = () => {
        const unReadMsgsIds = (messages || [])?.filter(msg => (!msg?.read_at && msg?.to_user === meId)).map(msg => msg?.id)

        if (unReadMsgsIds?.length > 0) {
            bulkMsgsRead(unReadMsgsIds)
        }
    }

    const loadMoreMessages = async () => {
        try {
            dispatch(appLoadStart())

            const lastMsg = messages[0]
            const last_loaded_at = lastMsg?.created_at

            await loadMessages({ msgLoadedTimeStamp: new Date().toISOString(), last_loaded_at, isOlder: true })

            const scrollToTopDelay = setTimeout(() => {
                // console.log("RUNNING")
                topRef?.current?.scrollIntoView({ behaviour: 'smooth' })
                clearTimeout(scrollToTopDelay)
            }, 0)

        } catch (error) {
            console.warn(error)
            toast.error('Error retrieving messages')

        } finally {
            dispatch(appLoadStop())
        }
    }

    const sendNow = () => {
        if (!input.trim()) return;
        sendMessage({
            text: input.trim(),
            community_id: community?.id,
            user_profile: {
                id: profile?.id,
                username: `Admin ~ ${profile?.username}`
            }
        });
        setInput('');
    };

    if (!community) return <></>

    const notifyMother = async () => {
        // try {
        //     dispatch(appLoadStart())

        //     await sendNotifications({
        //         tokens: [community?.notification_token],
        //         // sound: null,
        //         title: `Incoming message from lavendercare healthcare admin`,
        //         body: `New message detected`,
        //         data: {}
        //     });

        //     toast.success("Mother notified!")

        // } catch (error) {
        //     console.log(error)
        //     toast.error("Error notifying community. Messages have been sent though, she can view them on her lavendercare app")

        // } finally {
        //     dispatch(appLoadStop())
        // }
    }

    return (
        <div className=" bg-[#F8F9FB] mt-6 flex flex-col">
            {/*  */}
            <div className="flex flex-col p-3 gap-4 flex-1">
                {/* Chat Section */}
                <div className="flex items-center justify-between gap-1">
                    <div className="flex gap-2 items-center pb-3 border-b border-b-gray-300">
                        <ProfileImg
                            profile_img={community?.profile_img}
                            name={community?.name}
                            size="10"
                        />
                        <div>
                            <p className="m-0 p-0 text-sm text-purple-600 font-semibold">
                                {community?.name}
                            </p>
                            <p className={`m-0 p-0 font-semibold text-xs ${onlineUsers.length > 1 ? 'text-[#6F3DCB]' : 'text-gray-900'}`}>
                                {
                                    onlineUsers.length > 1
                                        ?
                                        `${onlineUsers.length - 1} user${onlineUsers.length - 1 > 1 ? 's' : ''} online`
                                        :
                                        'No user online'
                                }
                            </p>
                        </div>
                    </div>

                    {/* <button
                        onClick={notifyMother}
                        className="text-sm bg-purple-600 hover:bg-purple-700 text-white cursor-pointer rounded-lg px-3 py-1"
                    >
                        Notify community
                    </button> */}
                </div>

                <div className="max-h-[60vh] h-[60vh] min-h-[60vh] flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-grey-400">
                            <MdMessage
                                size={48}
                                className="text-[#6F3DCB]"
                            />
                            <p className="mt-2 text-lg font-bold text-grey-600">
                                No messages to display
                            </p>
                            <p className="text-sm text-grey-500 text-center">
                                Messages from this community will appear here
                            </p>
                        </div>
                    ) : (
                        ['initial', ...messages].map((msg, index) => {

                            if (msg === 'initial') {
                                if (!canLoadMoreMsgs) {
                                    return <></>
                                }
                                return (
                                    <div
                                        key={msg}
                                        ref={topRef}
                                        className="flex items-center justify-center my-2"
                                    >
                                        <div onClick={loadMoreMessages} className="cursor-pointer px-2 py-2 rounded-full bg-purple-600">
                                            <LuRotateCw size={20} color="#FFF" />
                                        </div>
                                    </div>
                                )
                            }

                            const { message, from_user, file_type, duration, pending, failed, created_at, read_at, delivered_at, user_profile } = msg

                            const iAmSender = from_user === meId ? true : false

                            const seen = read_at ? true : false
                            const delivered = delivered_at ? true : false

                            const lastMsgIndex = messages?.length - 1

                            const nextMsg = index !== lastMsgIndex && messages[index + 1]

                            return (
                                <div key={msg.id} className={`flex ${iAmSender ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        style={{
                                            width: file_type === 'audio' ? '80%' : 'auto'
                                        }}
                                    >
                                        {
                                            profile?.username
                                            &&
                                            (!nextMsg || (nextMsg && nextMsg?.from_user != user_profile?.id))
                                            &&
                                            <p className="text-[12px]" style={
                                                {
                                                    color: "#020201",
                                                    marginBottom: 5,
                                                    textAlign: iAmSender ? 'right' : 'left'
                                                }
                                            }>
                                                ~{user_profile?.username === profile?.username ? 'You' : user_profile?.username}
                                            </p>
                                        }

                                        <div className={`max-w-xs ${iAmSender
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                            } rounded-2xl px-4 py-3`}>
                                            {file_type === 'audio' ? (
                                                <div>
                                                    <AudioPlayer 
                                                        channelId={community?.id} 
                                                        filePath={message} 
                                                        durationMillis={duration*1000} 
                                                        iAmSender={iAmSender}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-sm mb-3">{message}</p>

                                                    <div className="flex flex-col items-end justify-end gap-">
                                                        <p
                                                            style={{
                                                                color: iAmSender ? '#FFF' : "_000"
                                                            }}
                                                            className="text-xs m-0 p-0"
                                                        >
                                                            {isoToAMPM({ isoString: created_at })}
                                                        </p>

                                                        {
                                                            iAmSender
                                                            &&
                                                            (
                                                                seen
                                                                    ?
                                                                    <IoCheckmarkDoneSharp size={11} color="#FFF" />
                                                                    :
                                                                    delivered
                                                                    &&
                                                                    <IoCheckmark size={11} color="#FFF" />
                                                            )
                                                        }
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end">
                                            {
                                                pending
                                                    ?
                                                    // <Tooltip>
                                                    //     <TooltipTrigger asChild>
                                                    <BsClockHistory color="#6F3DCB" size={15} />
                                                    // </TooltipTrigger>
                                                    //     <TooltipContent side="top" sideOffset={5}>
                                                    //         Pending message. Sending...
                                                    //     </TooltipContent>
                                                    // </Tooltip>                                                                    
                                                    :
                                                    failed
                                                    &&
                                                    // <Tooltip>
                                                    //     <TooltipTrigger asChild>
                                                    <LuMessageCircleWarning color="#c41a2b" size={15} />
                                                // </TooltipTrigger>
                                                //     <TooltipContent side="top" sideOffset={5}>
                                                //         Error sending message
                                                //     </TooltipContent>
                                                // </Tooltip>                                                                
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}

                    <div ref={bottomRef} />
                </div>

                {
                    (status == 'subscribed' && insertSubStatus == 'subscribed' && updateSubStatus == 'subscribed')
                        ?
                        <div className="flex items-center gap-2 mt-auto border-t pt-2">
                            <button className="text-gray-400">
                                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="9"
                                        stroke="#BDBDBD"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M7 10h6M10 7v6"
                                        stroke="#BDBDBD"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="flex-1 border rounded px-3 py-2 text-sm"
                                placeholder="Type a message..."
                            />
                            <button
                                onClick={sendNow}
                                className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded"
                            >
                                Send
                            </button>
                        </div>
                        :
                        <div className="flex items-center justify-center">
                            <div
                                onClick={refreshConnection}
                                className="text-center font-medium bg-purple-600 text-white m-3 py-3 px-7 cursor-pointer rounded-lg"
                            >
                                Want to send a msg?
                            </div>
                        </div>
                }
            </div>
        </div>
    );
}

export default CommunityChat;
