import { configureStore } from '@reduxjs/toolkit'
import appLoadingSlice from './slices/appLoadingSlice'
import userDetailsSlice from './slices/userDetailsSlice'
import adminState from './slices/adminState'
import messagesSlice from './slices/messagesSlice'

const store = configureStore({
    reducer: {
        appLoadingSlice,
        userDetailsSlice,
        adminState,
        messagesSlice
    }
})

export default store