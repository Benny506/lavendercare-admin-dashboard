import { createSlice } from "@reduxjs/toolkit"

const userDetailsSlice = createSlice({
    name: 'userDetailsSlice',
    initialState: {
        profile: null,
        user: null,
        session: null,
        permissions: null,
        roles: [],
        allPermissions: []
    },
    reducers: {
        setUserDetails: (state, action) => {
            if(action?.payload?.profile){
                state.profile = action.payload?.profile
            }
            if(action?.payload?.permissions){
                state.permissions = action.payload?.permissions
            }    
            if(action?.payload?.session){
                state.session = action.payload?.session
            }    
            if(action?.payload?.session){
                state.session = action.payload?.session
            }   
            if(action?.payload?.roles){
                state.roles = action.payload?.roles
            }   
            if(action?.payload?.allPermissions){
                state.allPermissions = action.payload?.allPermissions
            }                                                            
        },
        clearUserDetails: (state, action) => {
            state.profile = null
            state.permissions = null 
            state.session = null 
            state.user = null 
            state.roles = []
            state.allPermissions = []
        }        
    }
})

export const { setUserDetails, clearUserDetails } = userDetailsSlice.actions

export const getUserDetailsState = state => state.userDetailsSlice

export default userDetailsSlice.reducer