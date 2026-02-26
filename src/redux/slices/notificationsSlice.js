import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    fetched: false, // To track if initial fetch has been done
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.fetched = true;
      state.loading = false;
      state.error = null;
    },
    addNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
    },
    updateNotification: (state, action) => {
      const index = state.notifications.findIndex(
        (n) => n.id === action.payload.id
      );
      if (index !== -1) {
        state.notifications[index] = action.payload;
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  updateNotification,
  removeNotification,
  setLoading,
  setError,
} = notificationsSlice.actions;

export const getNotificationsState = (state) => state.notificationsSlice;

export default notificationsSlice.reducer;
