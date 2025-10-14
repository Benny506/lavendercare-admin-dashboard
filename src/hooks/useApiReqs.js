import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import supabase from "../database/dbInit";
import { formatBookings, getAdminState, setAdminState } from "../redux/slices/adminState";
import { appLoadStart, appLoadStop } from "../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";

export default function useApiReqs() {
    const dispatch = useDispatch()

    const mothers = useSelector(state => getAdminState(state).mothers)
    const vendors = useSelector(state => getAdminState(state).vendors)
    const providers = useSelector(state => getAdminState(state).providers)
    const bookings = useSelector(state => getAdminState(state).bookings)
    const products = useSelector(state => getAdminState(state).products)
    const mentalHealthScreenings = useSelector(state => getAdminState(state).mentalHealthScreenings)





    //users
    const loadMoreUsers = async ({ callBack = () => { } }) => {
        try {

            const limit = 1000

            dispatch(appLoadStart())

            const { data, error } = await supabase.rpc('get_all_profiles_with_email', {
                user_limit: limit,
                user_offset: mothers?.length,

                provider_limit: limit,
                provider_offset: providers?.length,

                vendor_limit: limit,
                vendor_offset: vendors?.length,
            })

            const { users: _m, providers: _p, vendors: _v } = data

            const m = _m || []
            const p = _p || []
            const v = _v || []

            if (m?.length === 0 && p?.length === 0 && v?.length === 0) {
                dispatch(appLoadStop())
                toast.info("All users loaded")

                callBack && callBack({ canLoadMore: false })

                return;
            }

            dispatch(setAdminState({
                mothers: [...mothers, ...m],
                providers: [...providers, ...p],
                vendors: [...vendors, ...v]
            }))

            dispatch(appLoadStop())

            toast.info("Users loaded")

            callBack && callBack({ canLoadMore: true })

        } catch (error) {
            console.log(error)
            toast.error("Error loading more users")
            dispatch(appLoadStop())
        }
    }





    //mental health screening
    const fetchTestResults = async ({ callBack = () => { } }) => {
        try {

            dispatch(appLoadStart())

            const limit = 1000;
            const from = (mentalHealthScreenings?.length || 0);
            const to = from + limit - 1;

            const { data, error } = await supabase
                .from('mental_health_test_answers')
                .select(`
                    *,
                    user_profile: user_profiles(*) 
                `)
                .order('created_at', { ascending: false, nullsFirst: false })
                .limit(limit)
                .range(from, to);

            if (error) {
                console.log(error)
                throw new Error()
            }

            if (data?.length === 0) {
                dispatch(appLoadStop())
                toast.info("All test results loaded")

                callBack && callBack({ canLoadMore: false })

                return;
            }

            dispatch(setAdminState({ mentalHealthScreenings: data }))

            dispatch(appLoadStop())

            callBack({ canLoadMore: true })

        } catch (error) {
            console.log(error)
            toast.error("Error loading test results")
            dispatch(appLoadStop())
        }
    }




    //bookings
    const fetchBookings = async ({ callBack = () => { } }) => {
        try {

            const limit = 1000;
            const from = (bookings?.length || 0);
            const to = from + limit - 1;

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('all_bookings')
                .select(`
                    *,
                    provider_profile: provider_profiles(*),
                    vendor_profile: vendor_profiles(*),
                    user_profile: user_profiles(*),
                    service_info: services(*)
                `)
                .order("created_at", { ascending: false, nullsFirst: false })
                .limit(limit)
                .range(from, to);

            if (error) {
                console.log(error)
                throw new Error()
            }

            if (data?.length === 0) {
                dispatch(appLoadStop())
                toast.info("All bookings loaded")

                callBack && callBack({ canLoadMore: false })

                return;
            }

            dispatch(setAdminState({
                bookings: data
            }))

            dispatch(appLoadStop())

            callBack && callBack({ canLoadMore: true, bookings: data })

        } catch (error) {
            console.log(error)
            toast.error("Error fetching bookings")
            dispatch(appLoadStop())
        }
    }




    //mothers
    // const fetchMotherBookings = async ({ callBack = () => {}, mother_id }) => {
    //     try {

    //         if(!mother_id) throw new Error();

    //         const { data: bookings, error: bookingsError } = await supabase
    //             .from('all_bookings')
    //             .select(`
    //                 *,
    //                 provider_profile: provider_profiles(*),             
    //                 vendor_profile: vendor_profiles(*)             
    //             `)
    //             .eq('user_id', mother_id)
    //             .order("day", { ascending: false, nullsFirst: false })      
    //             .order('start_time', { ascending: false, nullsFirst: false })            

    //         if(bookingsError){
    //             console.log("Bookings error", bookingsError)

    //             throw new Error()
    //         }       

    //         const formatted = formatBookings({ bookings })

    //         callBack({
    //             v_bookings: formatted.filter(b => b?.vendor_profile ? true : false),
    //             bookings: formatted.filter(b => b?.provider_profile ? true : false),
    //         })

    //         return;

    //     } catch (error) {
    //         console.log(error)
    //         toast.error("Error fetching mother bookings")
    //     }
    // }





    //providers  
    // const fetchProviderBookings = async ({ callBack = () => {}, provider_id }) => {
    //     try {

    //         if(!provider_id) throw new Error();

    //         const { data, error } = await supabase
    //             .from('all_bookings')
    //             .select(`
    //                 *,
    //                 user_profile: user_profiles (*)
    //             `)
    //             .eq('provider_id', provider_id)
    //             .order("day", { ascending: false, nullsFirst: false })      
    //             .order('start_time', { ascending: false, nullsFirst: false })                

    //         if(error){
    //             console.log(error)
    //             throw new Error()
    //         }

    //         callBack({
    //             bookings: formatBookings({ bookings: data }) 
    //         })

    //         return;

    //     } catch (error) {
    //         console.log(error)
    //         toast.error("Error fetching provider availabiliy")
    //     }
    // }  





    //vendors
    const fetchVendorServices = async ({ callBack = () => { }, vendor_id }) => {
        try {

            if (!vendor_id) throw new Error();

            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq("vendor_id", vendor_id)

            if (error) {
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
    // const fetchVendorBookings = async ({ callBack = () => {}, vendor_id }) => {
    //     try {

    //         if(!vendor_id) throw new Error();

    //         const { data, error } = await supabase
    //             .from('all_bookings')
    //             .select('*')
    //             .eq("vendor_id", vendor_id)

    //         console.log(data)

    //         if(error){
    //             console.log(error)
    //             throw new Error()
    //         }

    //         callBack({
    //             vendorBookings: data
    //         })

    //         return;

    //     } catch (error) {
    //         console.log(error)
    //         toast.error("Error retrieving vendor bookings")
    //     }
    // }





    //products
    const fetchProducts = async ({ callBack = () => { } }) => {
        try {

            const limit = 1000;
            const from = (products?.length || 0);
            const to = from + limit - 1;

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('products')
                .select(`
                    *
                `)
                .order("created_at", { ascending: false, nullsFirst: false })
                .limit(limit)
                .range(from, to);

            if (error) {
                console.log(error)
                throw new Error()
            }

            if (data?.length === 0) {
                dispatch(appLoadStop())
                toast.info("All products loaded")

                callBack && callBack({ canLoadMore: false })

                return;
            }

            dispatch(setAdminState({
                products: data
            }))

            dispatch(appLoadStop())

            callBack && callBack({ canLoadMore: true })

        } catch (error) {
            console.log(error)
            toast.error("Error fetching bookings")
            dispatch(appLoadStop())
        }
    }





    return {
        //users
        loadMoreUsers,





        //mental health screening
        fetchTestResults,





        //bookings
        fetchBookings,





        //mothers
        // fetchMotherBookings,





        //providers
        // fetchProviderBookings,





        //vendors
        fetchVendorServices,
        // fetchVendorBookings,





        //products
        fetchProducts,
    }
}