import { configureStore } from '@reduxjs/toolkit'
import appLoadingSlice from './slices/appLoadingSlice'
import userDetailsSlice from './slices/userDetailsSlice'
import adminState from './slices/adminState'

const store = configureStore({
    reducer: {
        appLoadingSlice,
        userDetailsSlice,
        adminState
    }
})

export default store