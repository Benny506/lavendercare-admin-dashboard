import { configureStore } from '@reduxjs/toolkit'
import appLoadingSlice from './slices/appLoadingSlice'
import userDetailsSlice from './slices/userDetailsSlice'
import adminState from './slices/adminState'
import messagesSlice from './slices/messagesSlice'
import notificationsSlice from './slices/notificationsSlice'
import subtleLoader from './slices/subtleLoaderSlice'

const store = configureStore({
    reducer: {
        appLoadingSlice,
        userDetailsSlice,
        adminState,
        messagesSlice,
        notificationsSlice,
        subtleLoader
    }
})

export default store