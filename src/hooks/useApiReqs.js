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




    //mothers
    const fetchMotherBookings = async ({ callBack = () => {}, mother_id }) => {
        try {

            if(!mother_id) throw new Error();

            const { data: bookings, error: bookingsError } = await supabase
                .from('bookings')
                .select(`
                    *,
                    provider_profile: provider_profiles(*)                
                `)
                .eq('user_id', mother_id)

            const { data: v_bookings, error: v_bookingsError } = await supabase
                .from('vendor_bookings')
                .select(`
                    *,
                    vendor_profile: vendor_profiles(*)                
                `)
                .eq('user_id', mother_id)   
                
            if(bookingsError || v_bookingsError){
                console.log("Bookings error", bookingsError)
                console.log("Vendor bookings error", v_bookingsError)

                throw new Error()
            }

            callBack({
                bookings,
                v_bookings
            })

            return;
            
        } catch (error) {
            console.log(error)
            toast.error("Error fetching mother bookings")
        }
    }





    return {
        //mental health screening
        fetchTestResults,





        //bookings
        fetchBookings,





        //mothers
        fetchMotherBookings
    }
}