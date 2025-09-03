import { useState } from "react";
import { useDispatch } from "react-redux";
import supabase from "../database/dbInit";
import { setAdminState } from "../redux/slices/adminState";
import { appLoadStart, appLoadStop } from "../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";

export default function useApiReqs(){
    const dispatch = useDispatch()





    //mental health screening
    const fetchTestResults = async ({ callBack = () => {} }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('mental_health_test_answers')
                .select(`
                    *,
                    user_profile: user_profiles(*) 
                `)
                .order('created_at', { ascending: false, nullsFirst: false })

            if(error){
                console.log(error)
                throw new Error()
            }

            dispatch(setAdminState({ mentalHealthScreenings: data }))

            dispatch(appLoadStop())

            callBack({ results: data })
        
        } catch (error) {
            console.log(error)
            toast.error("Error loading test results")
            dispatch(appLoadStop())
        }
    }   


    

    //bookings
    const fetchBookings = async ({ callBack = () => {} }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    provider_profile: provider_profiles(*),
                    user_profile: user_profiles(*)
                `)
                .order("created_at", { ascending: false, nullsFirst: false })
            
            if(error){
                console.log(error)
                throw new Error()
            }

            dispatch(setAdminState({
                bookings: data
            }))

            callBack({ bookings: data })

            dispatch(appLoadStop())
            
        } catch (error) {
            console.log(error)
            toast.error("Error fetching bookings")
            dispatch(appLoadStop())
        }
    }





    return {
        //mental health screening
        fetchTestResults,





        //bookings
        fetchBookings
    }
}