import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import supabase from '../database/dbInit';
import { getUserDetailsState } from '../redux/slices/userDetailsSlice';

const AdminChatContext = createContext();

export const supaAdmin = {
    id: 'f87d9999-b849-4d13-9876-3651e1f72116',
    username: 'Care-coordinator'
}

export const AdminChatProvider = ({ children }) => {
    const profile = useSelector(state => getUserDetailsState(state).profile);
    const user = useSelector(state => getUserDetailsState(state).user);
    const meId = supaAdmin?.id;

    const [conversations, setConversations] = useState([]);
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);

    const fetchConversations = useCallback(async () => {
        if (!meId) return;

        const { data, error } = await supabase.rpc('get_admin_chat_list', { p_admin_id: meId });

        if (!error && data) {
            setConversations(data);
            const total = data.reduce((acc, curr) => acc + parseInt(curr.unread_count || 0), 0);
            setTotalUnreadCount(total);
        } else {
            console.error("Error fetching admin conversations:", error);
        }
    }, [meId]);

    useEffect(() => {
        if (!meId) return;

        fetchConversations();

        // Subscribe to changes in admin_mothers_chat involving me (the admin)
        const subscription = supabase
            .channel('admin-global-messaging')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'admin_mothers_chat',
                    filter: `to_user=eq.${meId}`
                },
                () => {
                    fetchConversations();
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'admin_mothers_chat',
                    filter: `from_user=eq.${meId}`
                },
                () => {
                    fetchConversations();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [meId, fetchConversations]);

    return (
        <AdminChatContext.Provider value={{ conversations, totalUnreadCount, refreshConversations: fetchConversations }}>
            {children}
        </AdminChatContext.Provider>
    );
};

export const useAdminChat = () => useContext(AdminChatContext);
