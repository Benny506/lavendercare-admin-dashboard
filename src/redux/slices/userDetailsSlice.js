import { createSlice } from "@reduxjs/toolkit"

const userDetailsSlice = createSlice({
    name: 'userDetailsSlice',
    initialState: {
        profile: null,
    },
    reducers: {
        setUserDetails: (state, action) => {
            if(action?.payload?.profile){
                state.profile = action.payload?.profile
            }
        },
        clearUserDetails: (state, action) => {
            state.profile = null
        }        
    }
})

export const { setUserDetails, clearUserDetails } = userDetailsSlice.actions

export const getUserDetailsState = state => state.userDetailsSlice

export default userDetailsSlice.reducer