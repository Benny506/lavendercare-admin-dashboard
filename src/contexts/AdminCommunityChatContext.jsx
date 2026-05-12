import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getUserDetailsState } from '../redux/slices/userDetailsSlice';
import supabase from '../database/dbInit';

const AdminCommunityChatContext = createContext();

export const AdminCommunityChatProvider = ({ children }) => {
    const profile = useSelector(state => getUserDetailsState(state).profile);
    const meId = profile?.id;

    const [unreadCounts, setUnreadCounts] = useState({}); // { community_id: count }
    const [allCommunitiesUnread, setAllCommunitiesUnread] = useState(0);

    const fetchUnreadCounts = useCallback(async () => {
        if (!meId) return;

        try {
            const { data, error } = await supabase.rpc('get_community_unread_counts', { p_user_id: meId });

            if (!error && data) {
                const counts = {};
                let total = 0;
                data.forEach(item => {
                    counts[item.community_id] = parseInt(item.unread_count || 0);
                    total += parseInt(item.unread_count || 0);
                });
                setUnreadCounts(counts);
                setAllCommunitiesUnread(total);
            }
        } catch (error) {
            console.error("Error fetching admin community unread counts:", error);
        }
    }, [meId]);

    useEffect(() => {
        if (!meId) return;

        fetchUnreadCounts();

        const subscription = supabase
            .channel(`admin-community-unread-${meId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'community_chat'
                },
                (payload) => {
                    const newMsg = payload.new;
                    if (newMsg && newMsg.from_user !== meId) {
                        fetchUnreadCounts();
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'community_members',
                    filter: `user_id=eq.${meId}`
                },
                () => {
                    fetchUnreadCounts();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [meId, fetchUnreadCounts]);

    const getCommunityUnreadCount = (communityId) => unreadCounts[communityId] || 0;

    return (
        <AdminCommunityChatContext.Provider value={{ unreadCounts, allCommunitiesUnread, getCommunityUnreadCount, refreshUnreadCounts: fetchUnreadCounts }}>
            {children}
        </AdminCommunityChatContext.Provider>
    );
};

export const useAdminCommunityChat = () => {
    const context = useContext(AdminCommunityChatContext);
    if (!context) {
        throw new Error('useAdminCommunityChat must be used within an AdminCommunityChatProvider');
    }
    return context;
};
