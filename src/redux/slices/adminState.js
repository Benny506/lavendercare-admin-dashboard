import { createSlice } from "@reduxjs/toolkit";
import { getAppointmentStatus, sortByStatusPriority } from "../../lib/utils";

export const formatBookings = ({ bookings = [] }) => {
    const bookingsWithCorrectStatus = (bookings || []).map(b => {
        const { status, start_time, duration } = b

        const computedStatus = getAppointmentStatus({ status, start_time, duration_secs: duration })

        return {
            ...b,
            status: computedStatus
        }
    })

    return bookingsWithCorrectStatus

    const sortedWithPriority = sortByStatusPriority(bookingsWithCorrectStatus)

    return sortedWithPriority
}   


const adminState = createSlice({
    name: 'adminState',
    initialState: {
        mothers: [],
        vendors: [],
        providers: [],
        providerSpecialties: [],
        services: [],
        vendorServiceCategories: [],
        mentalHealthScreenings: [],
        highRiskAlerts: [],
        bookings: [],
        products: [],
        productCategories: []
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
            
            if(action?.payload?.services){
                state.services = action?.payload?.services
            }

            if(action?.payload?.mentalHealthScreenings){
                state.mentalHealthScreenings = action?.payload?.mentalHealthScreenings
            }     
            
            if(action.payload?.bookings){
                state.bookings = formatBookings({ bookings: action?.payload?.bookings })
            }       
            
            if(action.payload?.products){
                state.products = action.payload?.products
            }   
            
            if(action?.payload?.productCategories){
                state.productCategories = action?.payload?.productCategories
            }

            if(action?.payload?.providerSpecialties){
                state.providerSpecialties = action?.payload?.providerSpecialties
            }

            if(action?.payload?.vendorServiceCategories){
                state.vendorServiceCategories = action?.payload?.vendorServiceCategories
            }
        },                
    }
})

export const { setAdminState } = adminState.actions

export const getAdminState = state => state.adminState

export default adminState.reducer