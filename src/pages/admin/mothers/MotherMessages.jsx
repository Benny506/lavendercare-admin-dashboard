import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ProfileImg from "../components/ProfileImg";
import Modal from "../components/ui/Modal";
import { getUserDetailsState } from "../../../redux/slices/userDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useDirectChat } from "../../../hooks/chatHooks/useDirectChat";
import { dmTopic } from "../../../hooks/chatHooks/dm";
import { formatDate1, isoToAMPM, isToday, isYesterday } from "../../../lib/utils";
import { IoCheckmark, IoCheckmarkDoneSharp } from "react-icons/io5";
import { MdMessage } from "react-icons/md";
import { BsClockHistory, BsTrash } from "react-icons/bs";
import { LuMessageCircleWarning, LuRotateCw } from "react-icons/lu";
import { sendNotifications } from "../../../lib/notifications";
import { toast } from "react-toastify";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import supabase from "../../../database/dbInit";
import AudioPlayer from "../../../hooks/chatHooks/voiceNotes/AudioPlayer";
import MediaDisplay from "../components/MediaDisplay";
import { getPublicImageUrl, uploadAsset } from "../../../lib/requestApi";
import { IoIosSend } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import FailedMsgModal from "../components/chat/FailedMsgModal";
import ConfirmModal from "../components/ConfirmModal";

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
    const fileRef = useRef(null)

    const [showPopup, setShowPopup] = useState(false);
    const [input, setInput] = useState("");
    const [mother, setMother] = useState(mom)
    const [failedMsgModal, setFailedMsgModal] = useState({ visible: false, hide: null })
    const [confirmDelete, setConfirmDelete] = useState({ visible: false, hide: null })

    const meId = profile?.id
    const peerId = mother?.id
    const topic = peerId //Mother_id is the topic!

    const {
        sendMessage, messages, status, insertSubStatus, updateSubStatus, onlineUsers, loadMessages,
        canLoadMoreMsgs, bulkMsgsRead, refreshConnection, sendTempMedia, updateTempMedia, retrySend, deleteMessage,
        cancelRetrySend
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

    const openFailedMsgModal = ({ msg }) => setFailedMsgModal({ visible: true, hide: hideFailedMsgModal, msg })
    const hideFailedMsgModal = () => setFailedMsgModal({ visible: false, hide: null })

    const openConfirmDelete = ({ msg }) => setConfirmDelete({ visible: true, hide: hideConfirmDelete, msg })
    const hideConfirmDelete = () => setConfirmDelete({ visible: false, hide: null })

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
            toast.info("Could not retrieve mother profile")
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
            channel_id: topic,
            user_notification_token: mother?.notification_token
        });
        setInput('');
    };

    const retry = ({ msg }) => {
        const { file_type, message, id } = msg

        if (file_type === 'text' || (file_type !== 'text' && !typeof message !== 'object')) {
            sendMessage({ text: message, fileType: file_type, toUser: peerId, channel_id: topic, oldMsgId: id });

        } else {
            retrySend({ msgId: msg?.id })

            uploadAsset({
                file: [message],
                id: topic,
                bucket_name: 'chat_media',
                ext: message?.name.split(".").pop()?.toLowerCase() || "",
            })
                .then(({ filePath }) => {
                    if (!filePath) {
                        cancelRetrySend({ msgId: msg?.id })
                        return toast.error('Upload error')
                    }

                    sendMessage({
                        text: filePath,
                        fileType: file_type,
                        toUser: peerId,
                        channel_id: meId,
                        oldMsgId: id,
                    });
                })
                .catch(error => {
                    console.log(error)
                    cancelRetrySend({ msgId: msg?.id })
                    toast.error('Upload error')
                })
        }
    }

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

    const handleFileChange = (e) => {
        const MAX_SIZE = 15 * 1024 * 1024; // 15MB

        const file = e.target.files?.[0];
        if (!file) return;

        // Size check
        if (file.size > MAX_SIZE) {
            toast.info("File must be less than 15MB");
            return;
        }

        const mime = file.type;

        let type = ''
        let previewUrl = ''

        // Determine type
        if (mime.startsWith("image/")) {
            type = "image"

        } else if (mime.startsWith("video/")) {
            type = "video"

        } else if (
            mime === "application/pdf" ||
            mime === "application/msword"
            ||
            mime ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            toast.info("Only images, videos, are allowed")
            return;

        } else {
            toast.info("Only images, videos, are allowrd")
            return;
        }

        // Store file

        // Create preview URL for media

        const msg = sendTempMedia({
            file_type: type,
            text: file,
            toUser: peerId
        })

        uploadAsset({
            file: [file],
            id: topic,
            bucket_name: 'chat_media',
            ext: file?.name.split(".").pop()?.toLowerCase() || ""
        })
            .then(data => {
                const { error, filePaths } = data

                const uploadedFile = filePaths?.[0]

                updateTempMedia({
                    msgId: msg?.id,
                    failed: !uploadedFile ? true : false,
                    msgObj: {
                        ...msg,
                        message: uploadedFile
                    },
                    channel_id: topic
                })
            })
            .catch(err => {
                console.log(err)
                updateTempMedia({
                    msgId: msg?.id,
                    failed: true,
                    msgObj: {
                        ...msg,
                        message: uploadedFile
                    },
                    channel_id: topic
                })
            })
    };

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
                                            {file_type === 'audio' ? (
                                                <div>
                                                    <AudioPlayer
                                                        channelId={topic}
                                                        filePath={message}
                                                        durationMillis={duration * 1000}
                                                        iAmSender={iAmSender}
                                                    />
                                                </div>
                                            )
                                                :
                                                file_type === 'image' || file_type === 'video'
                                                    ?
                                                    (
                                                        <div>
                                                            <MediaDisplay
                                                                url={
                                                                    typeof message === 'object'
                                                                        ?
                                                                        URL.createObjectURL(message)
                                                                        :
                                                                        getPublicImageUrl({ path: message, bucket_name: 'chat_media' })
                                                                }
                                                                type={file_type}
                                                                align={iAmSender ? 'right' : 'left'}
                                                            />
                                                        </div>
                                                    )
                                                    : (
                                                        <div style={{ minWidth: '240px', minHeight: '20px' }}>
                                                            {
                                                                message
                                                                    ?
                                                                    <p className="text-sm mb-3">{message}</p>
                                                                    :
                                                                    <p style={{ fontStyle: 'italic' }} className="text-sm mb-3">Message deleted</p>
                                                            }
                                                        </div>
                                                    )}
                                            <div className="flex flex-col items-end justify-end">
                                                <div
                                                    style={{
                                                        height: '0.2px',
                                                        backgroundColor: iAmSender ? 'white' : 'gray',
                                                        width: '100%'
                                                    }}
                                                    className="mb-2 mt-4"
                                                />
                                                <p
                                                    style={{
                                                        color: iAmSender ? '#FFF' : "_000"
                                                    }}
                                                    className="text-xs m-0 p-0"
                                                >
                                                    {isoToAMPM({ isoString: created_at })}
                                                </p>
                                                <p
                                                    style={{
                                                        color: iAmSender ? '#FFF' : "_000"
                                                    }}
                                                    className="text-xs m-0 p-0"
                                                >
                                                    {isToday(created_at) ? 'Today' : isYesterday(created_at) ? 'Yesteday' : formatDate1({ dateISO: created_at })}
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
                                            {
                                                pending || failed
                                                    ?
                                                    <div style={{}} className="flex items-center justify-end mt-3">
                                                        <div style={{ borderRadius: '5px' }} className="p-1 bg-white">
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
                                                                    <div className="flex items-center gap-2">
                                                                        <LuMessageCircleWarning onClick={() => openFailedMsgModal({ msg })} color="#c41a2b" size={15} />
                                                                    </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    :
                                                    (message && iAmSender)
                                                    &&
                                                    <div style={{}} className="flex items-center justify-end mt-3">
                                                        <div onClick={() => openConfirmDelete({ msg })} style={{ borderRadius: '5px' }} className="p-1 bg-white">
                                                            <BsTrash color="#6F3DCB" />
                                                        </div>
                                                    </div>
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
                            <input
                                ref={fileRef}
                                type="file"
                                accept="
                                    image/*,
                                    video/*
                                "
                                style={{ display: "none" }}
                                onChange={e => {
                                    handleFileChange(e)
                                    e.target.value = null
                                }}
                            />

                            <button
                                className="text-gray-400"
                                onClick={(e) => {
                                    fileRef?.current?.click?.()
                                }}
                            >
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

            <FailedMsgModal
                isOpen={failedMsgModal.visible}
                onClose={failedMsgModal.hide}
                onDelete={() => deleteMessage({ msgId: failedMsgModal?.msg?.id, msg: failedMsgModal?.msg })}
                onResend={() => retry({ msg: failedMsgModal?.msg })}
            />

            <ConfirmModal
                modalProps={{
                    ...confirmDelete,
                    data: {
                        yesFunc: () => {
                            deleteMessage({ msgId: confirmDelete?.msg?.id, msg: confirmDelete?.msg })
                        },
                        title: 'Delete this message',
                        msg: 'This action cannot be undone!'
                    }
                }}
            />
        </div>
    );
}

export default MotherMessages;
