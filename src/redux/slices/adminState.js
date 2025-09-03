import { createSlice } from "@reduxjs/toolkit";
import { getAppointmentStatus, sortByStatusPriority } from "../../lib/utils";

const adminState = createSlice({
    name: 'adminState',
    initialState: {
        mothers: [],
        vendors: [],
        providers: [],
        vendorServices: [],
        mentalHealthScreenings: [],
        highRiskAlerts: [],
        bookings: []
    },
    reducers: {
        setAdminState: (state, action) => {
            if(action?.payload?.mothers){
                state.mothers = action.payload?.mothers?.map(m => {
                    return {
                        ...m,
                        role: 'mother',
                    }
                })
            }

            if(action?.payload?.vendors){
                state.vendors = action.payload?.vendors?.map(v => {
                    return {
                        ...v,
                        role: 'vendor'
                    }
                })
            }       
            
            if(action?.payload?.providers){
                state.providers = action.payload?.providers?.map(p => {
                    return {
                        ...p,
                        role: 'provider',
                        id: p?.id || p?.provider_id
                    }
                })
            }   
            
            if(action?.payload?.vendorServices){
                state.vendorServices = action?.payload?.vendorServices
            }

            if(action?.payload?.mentalHealthScreenings){
                state.mentalHealthScreenings = action?.payload?.mentalHealthScreenings
            }     
            
            if(action.payload?.bookings){
                const bookingsWithCorrectStatus = (action.payload?.bookings || []).map(b => {
                    const { status, hour, duration, day } = b

                    const date_ISO = new Date(day).toISOString()

                    const computedStatus = getAppointmentStatus({ status, date_ISO, startHour: hour, duration_secs: duration })

                    return {
                        ...b,
                        status: computedStatus
                    }
                })

                const sortedWithPriority = sortByStatusPriority(bookingsWithCorrectStatus)

                state.bookings = sortedWithPriority
            }             
        },                
    }
})

export const { setAdminState } = adminState.actions

export const getAdminState = state => state.adminState

export default adminState.reducer