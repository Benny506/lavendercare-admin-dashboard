import { configureStore } from '@reduxjs/toolkit'
import appLoadingSlice from './slices/appLoadingSlice'
import userDetailsSlice from './slices/userDetailsSlice'
import adminState from './slices/adminState'
import messagesSlice from './slices/messagesSlice'
import notificationsSlice from './slices/notificationsSlice'
import subtleLoader from './slices/subtleLoaderSlice'
import siteContent from './slices/siteContentSlice'
import chatSupport from './slices/chatSupportSlice'

const store = configureStore({
    reducer: {
        appLoadingSlice,
        userDetailsSlice,
        adminState,
        messagesSlice,
        notificationsSlice,
        subtleLoader,
        siteContent,
        chatSupport
    }
})

export default store