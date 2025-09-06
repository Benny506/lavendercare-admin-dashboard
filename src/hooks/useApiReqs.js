import { useState } from "react";
import { useDispatch } from "react-redux";
import supabase from "../database/dbInit";
import { formatBookings, setAdminState } from "../redux/slices/adminState";
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
                .order("day", { ascending: false, nullsFirst: false })      
                .order('hour', { ascending: false, nullsFirst: false })

            const { data: v_bookings, error: v_bookingsError } = await supabase
                .from('vendor_bookings')
                .select(`
                    *,
                    vendor_profile: vendor_profiles(*)                
                `)
                .eq('user_id', mother_id)   
                .order("day", { ascending: false, nullsFirst: false })      
                .order('start_hour', { ascending: false, nullsFirst: false })                
                
            if(bookingsError || v_bookingsError){
                console.log("Bookings error", bookingsError)
                console.log("Vendor bookings error", v_bookingsError)

                throw new Error()
            }          

            callBack({
                bookings: formatBookings({ bookings }),
                v_bookings: formatBookings({ bookings: v_bookings })
            })

            return;
            
        } catch (error) {
            console.log(error)
            toast.error("Error fetching mother bookings")
        }
    }





    //providers
    const fetchProviderAvailability = async ({ callBack = () => {}, provider_id }) => {
        try {

            if(!provider_id) throw new Error();

            const { data, error } = await supabase
                .from('provider_availability')
                .select('*')
                .eq('provider_id', provider_id)

            if(error){
                console.log(error)
                throw new Error()
            }

            callBack({
                providerAvailability: data 
            })

            return;
            
        } catch (error) {
            console.log(error)
            toast.error("Error fetching provider availabiliy")
        }
    }

    const fetchProviderBookingCostOptions = async ({ callBack = () => {}, provider_id }) => {
        try {

            if(!provider_id) throw new Error();

            const { data, error } = await supabase
                .from('provider_booking_cost_options')
                .select('*')
                .eq('provider_id', provider_id)

            console.log(data)

            if(error){
                console.log(error)
                throw new Error()
            }

            callBack({
                bookingCostOptions: data 
            })

            return;
            
        } catch (error) {
            console.log(error)
            toast.error("Error fetching provider booking cost options")
        }
    }    

    const fetchProviderBookings = async ({ callBack = () => {}, provider_id }) => {
        try {

            if(!provider_id) throw new Error();

            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    user_profile: user_profiles (*)
                `)
                .eq('provider_id', provider_id)
                .order("day", { ascending: false, nullsFirst: false })      
                .order('hour', { ascending: false, nullsFirst: false })                

            if(error){
                console.log(error)
                throw new Error()
            }

            callBack({
                bookings: formatBookings({ bookings: data }) 
            })

            return;
            
        } catch (error) {
            console.log(error)
            toast.error("Error fetching provider availabiliy")
        }
    }  
    
    



    //vendors
    const fetchVendorServices = async ({ callBack = () => {}, vendor_id }) => {
        try {

            if(!vendor_id) throw new Error();

            const { data, error } = await supabase
                .from('vendor_services')
                .select('*')
                .eq("vendor_id", vendor_id)
            
            if(error){
                console.log(error)
                throw new Error()
            }

            callBack({
                vendorServices: data
            })

            return;
            
        } catch (error) {
            console.log(error)
            toast.error("Error retrieving vendor services")
        }
    }
    const fetchVendorBookings = async ({ callBack = () => {}, vendor_id }) => {
        try {

            if(!vendor_id) throw new Error();

            const { data, error } = await supabase
                .from('vendor_bookings')
                .select('*')
                .eq("vendor_id", vendor_id)
            
            if(error){
                console.log(error)
                throw new Error()
            }

            callBack({
                vendorBookings: data
            })

            return;
            
        } catch (error) {
            console.log(error)
            toast.error("Error retrieving vendor bookings")
        }
    }





    return {
        //mental health screening
        fetchTestResults,





        //bookings
        fetchBookings,





        //mothers
        fetchMotherBookings,





        //providers
        fetchProviderAvailability,
        fetchProviderBookingCostOptions,
        fetchProviderBookings,





        //vendors
        fetchVendorServices,
        fetchVendorBookings,
    }
}