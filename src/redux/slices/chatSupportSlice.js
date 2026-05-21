import { createSlice } from '@reduxjs/toolkit';

const chatSupportSlice = createSlice({
    name: 'chatSupport',
    initialState: {
        chatNodes: null,
        unsavedChanges: false,
    },
    reducers: {
        setChatNodes: (state, action) => {
            state.chatNodes = action.payload;
        },
        setUnsavedChanges: (state, action) => {
            state.unsavedChanges = action.payload;
        }
    }
});

export const { setChatNodes, setUnsavedChanges } = chatSupportSlice.actions;

export const selectChatNodes = (state) => state.chatSupport.chatNodes;
export const selectUnsavedChanges = (state) => state.chatSupport.unsavedChanges;

export default chatSupportSlice.reducer;
