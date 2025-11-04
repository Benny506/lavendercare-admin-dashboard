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

function MotherMessages() {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { state } = useLocation()
    const [searchParams, setSearchParams] = useSearchParams();

    const mother_id = searchParams.get("mother_id");

    const mom = state?.mother

    const profile = useSelector(state => getUserDetailsState(state).profile)

    const bottomRef = useRef(null)
    const topRef = useRef(null)

    const [showPopup, setShowPopup] = useState(false);
    const [input, setInput] = useState("");
    const [mother, setMother] = useState(mom)

    const meId = profile?.id
    const peerId = mother?.id
    const topic = peerId //Mother_id is the topic!

    const {
        sendMessage, messages, status, insertSubStatus, updateSubStatus, onlineUsers, loadMessages,
        canLoadMoreMsgs, bulkMsgsRead, refreshConnection
    } = useDirectChat({
        topic,
        meId,
        peerId,
    })

    const peerOnline = onlineUsers.includes(peerId)

    useEffect(() => {
        if (!mother && !mother_id) {
            navigate('/admin/mothers')

        } else {
            if (mother_id && !mother) {
                fetchMom()
            }
        }
    }, [])

    useEffect(() => {
        if (messages?.length > 0) {
            bottomRef?.current?.scrollIntoView({ behaviour: 'smooth' })

            handleReadUnreadMsgs()
        }
    }, [messages]);

    const fetchMom = async () => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("user_profiles")
                .select("*")
                .single()
                .eq("id", mother_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            setMother(data)

        } catch (error) {
            console.log(error)
            navigate('/admin/mothers')

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
            toUser: peerId,
            user_notification_token: mother?.notification_token
        });
        setInput('');
    };

    if (!mother) return <></>

    const notifyMother = async () => {
        try {
            dispatch(appLoadStart())

            await sendNotifications({
                tokens: [mother?.notification_token],
                // sound: null,
                title: `Incoming message from lavendercare healthcare admin`,
                body: `New message detected`,
                data: {}
            });

            toast.success("Mother notified!")

        } catch (error) {
            console.log(error)
            toast.error("Error notifying mother. Messages have been sent though, she can view them on her lavendercare app")

        } finally {
            dispatch(appLoadStop())
        }
    }

    return (
        <div className="bg-[#F8F9FB] w-full mt-6 flex flex-col">
            {/*  */}
            <div className="flex flex-col p-3 gap-4 flex-1">
                {/* Chat Section */}
                <div className="flex items-center justify-between gap-1">
                    <div className="flex gap-2 items-center pb-3 border-b border-b-gray-300">
                        <Link to="/admin/mothers/single-mother" state={{ user: mother }}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect width="24" height="24" rx="5" fill="#F5F5F5" />
                                <g opacity="0.8">
                                    <path
                                        d="M15.41 16.4066L10.83 12.0002L15.41 7.59383L14 6.24023L8 12.0002L14 17.7602L15.41 16.4066Z"
                                        fill="#202224"
                                    />
                                </g>
                            </svg>
                        </Link>
                        <ProfileImg
                            profile_img={mother?.profile_img}
                            name={mother?.name}
                            size="10"
                        />
                        <div>
                            <p className="m-0 p-0 text-sm text-purple-600 font-semibold">
                                {mother?.name}
                            </p>
                            <p className={`m-0 p-0 font-semibold text-xs ${peerOnline ? 'text-[#6F3DCB]' : 'text-gray-900'}`}>
                                {peerOnline ? 'online' : onlineUsers.length > 0 ? 'offline' : ''}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={notifyMother}
                        className="text-sm bg-purple-600 hover:bg-purple-700 text-white cursor-pointer rounded-lg px-3 py-1"
                    >
                        Notify mother
                    </button>
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
                                Messages from this mother will appear here
                            </p>
                        </div>
                    ) : (
                        ['initial', ...messages].map((msg) => {

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

                            const { message, from_user, pending, failed, created_at, read_at, delivered_at, file_type, duration } = msg

                            const iAmSender = from_user === meId ? true : false

                            const seen = read_at ? true : false
                            const delivered = delivered_at ? true : false

                            return (
                                <div key={msg.id} className={`flex ${iAmSender ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        style={{
                                            width: file_type === 'audio' ? '80%' : 'auto'
                                        }}
                                    >
                                        <div className={`max-w-xs ${iAmSender
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                            } rounded-2xl px-4 py-3`}>
                                            {file_type ? (
                                                <div>
                                                    <AudioPlayer
                                                        channelId={topic}
                                                        filePath={message}
                                                        durationMillis={duration * 1000}
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

                {/* Right-side Popup Trigger */}
                <div className="hidden md:block w-0"></div>
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded font-semibold text-xs">
                        Mark as Resolved
                    </button>
                    <button
                        className="bg-gray-100 px-2 py-2 rounded"
                        onClick={() => setShowPopup(true)}
                    >
                        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="2" fill="#8B8B8A" />
                            <circle cx="10" cy="5" r="2" fill="#8B8B8A" />
                            <circle cx="10" cy="15" r="2" fill="#8B8B8A" />
                        </svg>
                    </button>
                </div>
                {/* Popup (Image 3) */}
                {showPopup && (
                    <Modal
                        isOpen={true}
                        onClose={() => setShowPopup(false)}
                        className="w-full md:w-80 bg-white rounded-t-2xl md:rounded-2xl shadow-lg p-6 m-0 md:mr-8 md:mb-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src="https://randomuser.me/api/portraits/women/44.jpg"
                                alt="avatar"
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <div className="font-semibold">Chinenye Okeke</div>
                                <div className="text-xs text-gray-500">User Information</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">Age: -</div>
                        <div className="text-xs text-gray-500 mb-2">
                            Contact: email@example.com
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                            Phone no: 0801 234 5678
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
}

export default MotherMessages;
