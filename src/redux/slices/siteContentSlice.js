import { createSlice } from '@reduxjs/toolkit';

export const siteContentSlice = createSlice({
    name: 'siteContent',
    initialState: {
        pages: {},
        unsavedChanges: false
    },
    reducers: {
        setPageContent: (state, action) => {
            const { pageId, content } = action.payload;
            state.pages[pageId] = content;
        },
        setUnsavedChanges: (state, action) => {
            state.unsavedChanges = action.payload;
        }
    }
});

export const { setPageContent, setUnsavedChanges } = siteContentSlice.actions;

export const selectPageContent = (pageId) => (state) => state.siteContent.pages[pageId];
export const selectUnsavedChanges = (state) => state.siteContent.unsavedChanges;

export default siteContentSlice.reducer;
