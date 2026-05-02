import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminChat } from "../../../contexts/AdminChatContext";
import ProfileImg from "../components/ProfileImg";
import PathHeader from "../components/PathHeader";
import { isoToAMPM, formatDate1, isToday, isYesterday } from "../../../lib/utils";
import { MdMessage, MdKeyboardVoice, MdPhoto, MdVideoLibrary } from "react-icons/md";
import { LuRotateCw } from "react-icons/lu";
import { getPublicImageUrl } from "../../../lib/requestApi";

function MotherInbox() {
    const navigate = useNavigate();
    const { conversations, refreshConversations, totalUnreadCount } = useAdminChat();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredConversations = useMemo(() => {
        if (!searchTerm.trim()) return conversations;
        return conversations.filter(c => 
            c.peer_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [conversations, searchTerm]);

    const handleRowClick = (conv) => {
        navigate(`/admin/mothers/mother-messages?mother_id=${conv.peer_id}`, { 
            state: { 
                mother: { 
                    id: conv.peer_id, 
                    name: conv.peer_name, 
                    profile_img: conv.peer_img 
                } 
            } 
        });
    };

    const renderLastMsgSnippet = (conv) => {
        if (conv.last_message_type === 'audio') return <div className="flex items-center gap-1 text-gray-500"><MdKeyboardVoice size={16}/> Voice note</div>;
        if (conv.last_message_type === 'image') return <div className="flex items-center gap-1 text-gray-500"><MdPhoto size={16}/> Photo</div>;
        if (conv.last_message_type === 'video') return <div className="flex items-center gap-1 text-gray-500"><MdVideoLibrary size={16}/> Video</div>;
        return <p className="text-gray-500 text-sm truncate">{conv.last_message}</p>;
    };

    return (
        <div className="pt-6 w-full pb-5 px-4 md:px-8">
            <PathHeader 
                paths={[
                    { text: 'User Management' },
                    { text: 'Mother Messages' }
                ]}
            />

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Maternal Support Inbox</h2>
                        <p className="text-sm text-gray-500">Manage conversations with mothers ({totalUnreadCount} unread)</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <MdMessage className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                        <button 
                            onClick={refreshConversations}
                            className="p-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors"
                            title="Refresh Conversations"
                        >
                            <LuRotateCw size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
                    {filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <MdMessage size={64} className="text-gray-200 mb-4" />
                            <p className="text-lg font-medium">No conversations found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {filteredConversations.map((conv) => (
                                <div 
                                    key={conv.peer_id}
                                    onClick={() => handleRowClick(conv)}
                                    className="flex items-center p-4 hover:bg-purple-50/50 cursor-pointer transition-colors group"
                                >
                                    <div className="relative">
                                        <ProfileImg 
                                            profile_img={conv.peer_img ? getPublicImageUrl({ path: conv.peer_img, bucket_name: 'user_profiles' }) : null}
                                            name={conv.peer_name}
                                            size="12"
                                        />
                                        {conv.unread_count > 0 && (
                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                                                {conv.unread_count}
                                            </div>
                                        )}
                                    </div>

                                    <div className="ml-4 flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className={`text-sm font-semibold truncate ${conv.unread_count > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {conv.peer_name}
                                            </h4>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {isToday(conv.last_message_at) 
                                                    ? isoToAMPM({ isoString: conv.last_message_at }) 
                                                    : isYesterday(conv.last_message_at) 
                                                        ? 'Yesterday' 
                                                        : formatDate1({ dateISO: conv.last_message_at })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1 min-w-0">
                                                {renderLastMsgSnippet(conv)}
                                            </div>
                                            {conv.unread_count > 0 && (
                                                <div className="h-2 w-2 bg-purple-600 rounded-full ml-2 shadow-[0_0_8px_rgba(111,61,203,0.5)]"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MotherInbox;
