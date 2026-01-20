import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import supabase from "../database/dbInit";
import { formatBookings, getAdminState, setAdminState } from "../redux/slices/adminState";
import { appLoadStart, appLoadStop } from "../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";
import { setUserDetails } from "../redux/slices/userDetailsSlice";
import { getPublicImageUrl, requestApi } from "../lib/requestApi";
import { v4 as uuidv4 } from "uuid";
import { sendNotifications } from "../lib/notifications";
import { sendEmail } from "../lib/email";
import { groupBy } from "../lib/utils";

export default function useApiReqs() {
    const dispatch = useDispatch()

    const mothers = useSelector(state => getAdminState(state).mothers)
    const vendors = useSelector(state => getAdminState(state).vendors)
    const providers = useSelector(state => getAdminState(state).providers)
    const bookings = useSelector(state => getAdminState(state).bookings)
    const products = useSelector(state => getAdminState(state).products)
    const productCategories = useSelector(state => getAdminState(state).productCategories)
    const providerSpecialties = useSelector(state => getAdminState(state).providerSpecialties)
    const mentalHealthScreenings = useSelector(state => getAdminState(state).mentalHealthScreenings)
    const vendorServiceCategories = useSelector(state => getAdminState(state).vendorServiceCategories)
    const services = useSelector(state => getAdminState(state).services)





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
            const from = 0
            // const from = (mentalHealthScreenings?.length || 0);
            const to = from + limit - 1;

            const { data, error } = await supabase
                .from('mental_health_test_answers')
                .select(`
                    *,
                    user_profile: user_profiles(*),
                    test_feedback: in_app_notifications(*)
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
            // dispatch(setAdminState({ mentalHealthScreenings: [...mentalHealthScreenings, ...data] }))

            dispatch(appLoadStop())

            callBack({ canLoadMore: true })

        } catch (error) {
            console.log(error)
            toast.error("Error loading test results")
            dispatch(appLoadStop())
        }
    }
    const sendTestFeedBack = async ({ callBack = () => { }, requestInfo, user_id }) => {
        try {

            dispatch(appLoadStart())

            await sendNotifications({
                tokens: [requestInfo?.user_profile?.notification_token],
                title: 'Mental-Health-Test-Feedback',
                body: `We have recommendations for you`,
                data: {}
            })

            const { result } = await requestApi({
                url: 'https://tzsbbbxpdlupybfrgdbs.supabase.co/functions/v1/retrieve-user-email',
                method: 'POST',
                data: {
                    user_id
                }
            })

            const email = result?.email

            if (!email) throw new Error();

            await sendEmail({
                // from_email: ''
                to_email: email,
                subject: 'Care-Coordinator feedback',
                data: {
                    "title": "Mental-Health-Test-Review",
                    "message": "We have reviewed your recent mental health tests. And from our evaluations, we have recommended the following to you. Click the link below to open the app and view more information",
                    "total_products": requestInfo?.product_ids?.length || 0,
                    "total_services": requestInfo?.service_ids?.length || 0,
                    "total_providers": requestInfo?.provider_ids?.length || 0,
                },
                template_id: 'x2p03470q3kgzdrn'
            })

            const { data, error } = await supabase
                .from('in_app_notifications')
                .insert(requestInfo)
                .select()
                .single()

            if (error) {
                console.log(error)
                throw new Error();
            }

            const updatedScreens = (mentalHealthScreenings || [])?.map(sc => {
                if (sc?.id === requestInfo?.test_id) {
                    return {
                        ...sc,
                        feedback_sent: true
                    }
                }

                return sc
            })

            dispatch(setAdminState({ mentalHealthScreenings: updatedScreens }))

            dispatch(appLoadStop())

            callBack && callBack({ newFeedBack: data })

            toast.success("Feedback sent to mother")

        } catch (error) {
            console.log(error)
            toast.error("Error sending test feed-back, try again later")
            dispatch(appLoadStop())
        }
    }
    const fetchAssignedProviders = async ({ callBack = () => { } }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("assigned_providers")
                .select("*")

            if (error) {
                console.log(error)
                throw new Error()
            }

            const grouped = Object.values(
                data.reduce((acc, { provider_id, mother_id, ...rest }) => {
                    if (!acc[provider_id]) {
                        acc[provider_id] = {
                            provider_id,
                            items: []
                        }
                    }

                    acc[provider_id].items.push({
                        ...rest,
                        mother_id
                    })

                    return acc
                }, {})
            )

            dispatch(appLoadStop())

            callBack && callBack({ assignedProviders: grouped })

        } catch (error) {
            console.log(error)
            toast.error("Error loading assigned providers")
            dispatch(appLoadStop())
        }
    }
    const fetchProviderAssignments = async ({ callBack = () => { }, provider_id }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("assigned_providers")
                .select(`
                    *,
                    user_profile: user_profiles (*)
                `)
                .eq("provider_id", provider_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ providerAssignments: data })

        } catch (error) {
            console.log(error)
            toast.error("Error loading provider assignments")
            dispatch(appLoadStop())
        }
    }
    const assignProvider = async ({ callBack = () => { }, provider_id, mother_id }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("assigned_providers")
                .insert({
                    provider_id,
                    mother_id
                })
                .select()
                .single()

            if (error) {
                console.log(error)
                if (error.message.includes("duplicate key")) {
                    toast.info("Provider already assigned to this mother")
                    dispatch(appLoadStop())

                    return
                }
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ newAssignment: data })

        } catch (error) {
            console.log(error)
            toast.error("Error assigning provider")
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
                    provider: providers( * ),
                    user_profile: user_profiles( * ),
                    service_info: services( * )
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
                bookings: [...bookings, ...data]
            }))

            dispatch(appLoadStop())

            callBack && callBack({ canLoadMore: true, bookings: data })

        } catch (error) {
            console.log(error)
            toast.error("Error fetching bookings")
            dispatch(appLoadStop())
        }
    }
    const fetchProviderBookings = async ({ callBack = () => { }, provider_id }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('all_bookings')
                .select(`
                    *,
                    provider: providers( * ),
                    user_profile: user_profiles( * ),
                    service_info: services( * )
                `)
                .order("created_at", { ascending: false, nullsFirst: false })
                .eq("provider_id", provider_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ bookings: data })

        } catch (error) {
            console.log(error)
            toast.error("Error fetching provider bookings")
            dispatch(appLoadStop())
        }
    }





    //mothers
    const fetchSingleMother = async ({ callBack = () => { }, mother_id }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("user_profiles")
                .select(`
                    *,
                    bookings: all_bookings (
                        *,
                        provider: providers( * ),
                        service_info: services( * )                        
                    ),
                    assignedProviders: assigned_providers (
                        *,
                        providerInfo: providers ( * )
                    )
                `)
                .eq("id", mother_id)
                .single()

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ mother: data })

        } catch (error) {
            console.log(error)
            callBack && callBack({ mother: null })
            toast.error("Error loading single mother")
            dispatch(appLoadStop())
        }
    }




    //vendors
    const fetchServices = async ({ callBack = () => { } }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("services")
                .select(`
                    *,
                    provider: providers ( * )
                    types: service_types ( * )                    
                `)

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            dispatch(setAdminState({ services: data }))

            callBack && callBack({ services: data })

        } catch (error) {
            console.log(error)
            dispatch(appLoadStop())
            toast.error("Error retrieving services")
        }
    }
    const fetchVendorServices = async ({ callBack = () => { }, vendor_id }) => {
        try {

            if (!vendor_id) throw new Error();

            const { data, error } = await supabase
                .from('services')
                .select(`
                    *,
                    types: service_types ( * )
                `)
                .eq("provider_id", vendor_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            callBack({
                services: data
            })

            return;

        } catch (error) {
            console.log(error)
            toast.error("Error retrieving vendor services")
            // dispatch(appL)
        }
    }
    const fetchVendorServiceCategories = async ({ callBack = () => { } }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('vendor_service_categories')
                .select("*")

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(setAdminState({
                vendorServiceCategories: data
            }))

            dispatch(appLoadStop())

            callBack && callBack({})

        } catch (error) {
            console.log(error)
            toast.error("Error retrieving vendor services")
            dispatch(appLoadStop())
        }
    }
    const addVendorServiceCategory = async ({ callBack = () => { }, service }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('vendor_service_categories')
                .insert({
                    service
                })
                .select()
                .single()

            if (error) {
                console.log(error)
                throw new Error()
            }

            const vsCategories = [...(vendorServiceCategories || []), data]

            dispatch(setAdminState({
                vendorServiceCategories: vsCategories
            }))

            dispatch(appLoadStop())

            callBack && callBack({})

            toast.success("New service category added!")

        } catch (error) {
            console.log(error)
            toast.error("Error adding vendor service category")
            dispatch(appLoadStop())
        }
    }
    const deleteVendorServiceCategory = async ({ callBack = () => { }, service }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('vendor_service_categories')
                .delete()
                .eq("service", service)

            if (error) {
                console.log(error)
                throw new Error()
            }

            const vsCategories = vendorServiceCategories?.filter(sc => sc?.service?.toLowerCase() !== service?.toLowerCase())

            dispatch(setAdminState({
                vendorServiceCategories: vsCategories
            }))

            dispatch(appLoadStop())

            callBack && callBack({})

            toast.success("Service category deleted!")

        } catch (error) {
            console.log(error)
            toast.error("Error deleting vendor service category")
            dispatch(appLoadStop())
        }
    }
    const deleteServiceType = async ({ callBack = () => { }, type_id, service_id }) => {
        try {

            if (!type_id || !service_id) throw new Error();

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("service_types")
                .delete()
                .eq("id", type_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            const updatedVendorServices = services?.map(service => {
                if (service?.id === service_id) {

                    const types = service?.types || []

                    const updatedTypes = types?.filter(t => t?.id !== type_id)

                    return {
                        ...service,
                        types: updatedTypes
                    }
                }

                return service
            })

            dispatch(setAdminState({ services: updatedVendorServices }))

            dispatch(appLoadStop())

            callBack && callBack({ deleted_type_id: type_id })

            toast.success("Session info saved")

        } catch (error) {
            console.log(error)
            apiReqError({ errorMsg: 'Something went wrong! Try again' })
        }
    }
    const updateServiceType = async ({ callBack = () => { }, type_id, update }) => {
        try {

            if (!update || !type_id) throw new Error();

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("service_types")
                .update(update)
                .eq("id", type_id)
                .select()
                .single()

            if (error) {
                console.log(error)
                if (error.message?.toLowerCase().includes("duplicate key")) return apiReqError({ errorMsg: 'Session with this duration already exists for this service' });
                throw new Error()
            }

            const updatedVendorServices = services?.map(service => {
                if (service?.id === data?.service_id) {
                    const types = service?.types || []

                    const updatedTypes = types?.map(t => {
                        if (t?.id === type_id) {
                            return data
                        }

                        return t
                    })

                    return {
                        ...service,
                        types: updatedTypes
                    }
                }

                return service
            })

            dispatch(setAdminState({ services: updatedVendorServices }))

            dispatch(appLoadStop())

            callBack({ updatedServiceType: data })

            toast.success("Session info saved")

        } catch (error) {
            console.log(error)
            apiReqError({ errorMsg: 'Something went wrong! Try again' })
        }
    }
    const insertServiceType = async ({ callBack = () => { }, requestInfo }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("service_types")
                .insert(requestInfo)
                .select()
                .single()

            if (error) {
                console.log(error)
                if (error.message?.toLowerCase().includes("duplicate key")) return apiReqError({ errorMsg: 'Session with this duration already exists for this service' });
                throw new Error()
            }

            const updatedVendorServices = services?.map(service => {
                if (service?.id === data?.service_id) {
                    const types = service?.types || []

                    const updatedTypes = [data, ...types]

                    return {
                        ...service,
                        types: updatedTypes
                    }
                }

                return service
            })

            dispatch(setAdminState({ services: updatedVendorServices }))

            dispatch(appLoadStop())

            callBack && callBack({ newServiceType: data })

            toast.success("Session info saved")

        } catch (error) {
            console.log(error)
            apiReqError({ errorMsg: 'Something went wrong! Try again' })
        }
    }
    const updateService = async ({ callBack = () => { }, update, service_id }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('services')
                .update(update)
                .eq('id', service_id)
                .select()
                .single()

            if (error) {
                console.log(error)
                throw new Error()
            }

            const updatedServices = services?.map(service => {
                if (service?.id === service_id) {
                    return {
                        ...service,
                        ...data
                    }
                }

                return service
            })

            dispatch(setAdminState({ services: updatedServices }))

            dispatch(appLoadStop())

            callBack && callBack({ updatedService: data })

            toast.success("Service updated")

        } catch (error) {
            console.log(error)
            apiReqError({ errorMsg: 'Something went wrong! Try again' })
        }
    }
    const fetchSingleService = async ({ callBack = () => { }, service_id }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("services")
                .select(`
                    *,
                    types: service_types ( * )    
                `)
                .single()
                .eq("id", service_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ service: data })


        } catch (error) {
            console.log(error)
            callBack && callBack({ service: null })
            apiReqError({ errorMsg: 'Something went wrong! Try again' })
        }
    }
    const getServiceCategories = async ({ callBack = () => { } }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("vendor_service_categories")
                .select("*");

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ serviceCategories: data })

        } catch (error) {
            console.log(error)
            return apiReqError({ errorMsg: 'Error loading services categories' })
        }
    }
    const addService = async ({ callBack = () => { }, serviceInfo, serviceTypes = [], provider }) => {
        try {

            const provider_id = provider?.id

            if (serviceTypes?.length === 0) throw new Error()

            dispatch(appLoadStart())

            const { data: newService, error: newServiceError } = await supabase
                .from("services")
                .insert({
                    ...serviceInfo,
                    provider_id
                })
                .select()
                .single()

            if (newServiceError) {
                console.log("newServiceError", newServiceError)
                throw new Error()
            }

            const { data: newServiceTypes, error: newServiceTypesError } = await supabase
                .from("service_types")
                .insert(serviceTypes?.map(sType => {
                    return {
                        ...sType,
                        service_id: newService?.id
                    }
                }))
                .select()

            if (newServiceTypesError) {
                await supabase.from("services").delete().eq("id", newService?.id)
                console.log("newServiceTypesError", newServiceTypesError)
                throw new Error()
            }

            const updatedServices = [{ ...newService, types: newServiceTypes, provider }, ...(services || [])]

            dispatch(setAdminState({ services: updatedServices }))

            dispatch(appLoadStop())

            callBack && callBack({})

            toast.success("Service created")

        } catch (error) {
            console.log(error)
            return apiReqsError({ errorMsg: 'Error adding service' })
        }
    }





    //products
    const fetchProducts = async ({ callBack = () => { } }) => {
        try {

            const limit = 1000;
            const from = [] || (products?.length || 0);
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
                // toast.info("All products loaded")

                callBack && callBack({ canLoadMore: false })

                return;
            }

            dispatch(setAdminState({
                // products: [...products, ...data]
                products: data
            }))

            dispatch(appLoadStop())

            callBack && callBack({ canLoadMore: true, products: data })

        } catch (error) {
            console.log(error)
            toast.error("Error fetching products")
            dispatch(appLoadStop())
        }
    }
    const fetchSingleProduct = async ({ callBack = () => { }, product_id }) => {
        try {

            if (!product_id) throw new Error();

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    product_variants_combinations ( * )
                `)
                .single()
                .eq("id", product_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            const image_urls = (data?.product_images || [])?.map(imgPath => {
                return getPublicImageUrl({ path: imgPath, bucket_name: 'admin_products' })
            })

            const enrichedProduct = {
                ...data,
                image_urls
            }

            dispatch(appLoadStop())

            callBack && callBack({ product: enrichedProduct })

        } catch (error) {
            console.log(error)
            toast.error("Error fetching single product")
            dispatch(appLoadStop())
            callBack && callBack({ product: null })
        }
    }
    const fetchAllVariantTypesAndValues = async ({ callBack = () => { } }) => {
        try {

            function groupValuesByType(types, values) {
                const typeMap = {};

                // Initialize groups using the types array
                types.forEach(type => {
                    typeMap[type.id] = {
                        ...type,
                        values: []
                    };
                });

                // Attach values to the matching type
                values.forEach(val => {
                    const typeId = val.variant_type_id;
                    if (typeMap[typeId]) {
                        typeMap[typeId].values.push(val);
                    }
                });

                return Object.values(typeMap);
            }

            dispatch(appLoadStart())

            const { data: values, error: valuesError } = await supabase
                .from("product_variant_values")
                .select(`
                    *,
                    type: variant_type_id ( * )     
                `)
                .order("created_at", { ascending: false })

            const { data: types, error: typesError } = await supabase
                .from("product_variant_types")
                .select(`*`)
                .order("created_at", { ascending: false })

            if (valuesError || typesError) {
                console.log(valuesError, "valuesError")
                console.log(typesError, "typesError")

                throw new Error()
            }

            const groupedTypes = groupValuesByType(types, values)

            dispatch(appLoadStop())

            callBack && callBack({
                types: groupedTypes,
                values
            })

        } catch (error) {
            console.log(error)
            toast.error("Error fetching variant type and value")
            dispatch(appLoadStop())
            callBack && callBack({ values: null, types: null })
        }
    }
    const addVariantsCombination = async ({ callBack = () => { }, product_id, price_value, price_currency, stock, options, virtual_files = null, is_virtual = false }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('product_variants_combinations')
                .insert({
                    product_id,
                    price_value,
                    price_currency,
                    stock,
                    options,
                    virtual_files,
                    is_virtual
                })
                .select()
                .single()

            if (error) {
                if (error.message?.toLowerCase().includes("duplicate key")) {
                    dispatch(appLoadStop())
                    return toast.error("Variants combination already exists for this product")
                }

                console.log(error)
                throw new Error()
            }

            const updatedProducts = (products || [])?.map(p => {
                if (p?.id === product_id) {
                    const updatedVariantsCombinations = [data, ...(p?.product_variants_combinations || [])]

                    return {
                        ...p,
                        product_variants_combinations: updatedVariantsCombinations
                    }
                }

                return p
            })

            dispatch(setAdminState({
                products: updatedProducts
            }))

            dispatch(appLoadStop())

            callBack && callBack({ newVariantCombo: data })

            toast.success("Added variants combination")

        } catch (error) {
            console.log(error)
            toast.error("Error adding variant combination")
            dispatch(appLoadStop())
        }
    }
    const updateVarantCombinaton = async ({ callBack = () => { }, combo_id, update }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("product_variants_combinations")
                .update(update)
                .eq("id", combo_id)
                .select()
                .single()

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ updatedVCombo: data })

            toast.success("Variant updated")

        } catch (error) {
            console.log(error)
            toast.error("Error updating variant combination")
            dispatch(appLoadStop())
        }
    }
    const addVariantType = async ({ callBack = () => { }, name }) => {
        try {

            if (!name) throw new Error();

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("product_variant_types")
                .insert({ name })
                .select()
                .single()

            if (error) {
                console.log(error)
                if (error.message?.toLowerCase().includes("duplicate key")) {
                    dispatch(appLoadStop())
                    return toast.error("Variant type already exists for this product")
                }
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ newVariantType: data })

            toast.success("Variant type added")

        } catch (error) {
            console.log(error)
            toast.error("Error adding varaint type")
            dispatch(appLoadStop())
        }
    }
    const deleteVariantType = async ({ callBack = () => { }, type_id }) => {
        try {

            if (!type_id) throw new Error();

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("product_variant_types")
                .delete()
                .eq("id", type_id)

            if (error) {
                console.log(error)
                throw new Error();
            }

            dispatch(appLoadStop())

            callBack && callBack({ deleted_type_id: type_id })

            toast.success("Variant type deleted")

        } catch (error) {
            console.log(error)
            toast.error("Error deleting varaint type")
            dispatch(appLoadStop())
        }
    }
    const addVariantValue = async ({ callBack = () => { }, variant_type_id, value }) => {
        try {

            if (!variant_type_id || !value) throw new Error();

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('product_variant_values')
                .insert({
                    variant_type_id,
                    value
                })
                .select()
                .single()

            if (error) {
                console.log(error)
                if (error.message?.toLowerCase().includes("duplicate key")) {
                    dispatch(appLoadStop())
                    return toast.error("Variant type and value combination already exists")
                }
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({
                newVariantValue: data
            })

            toast.success("Variant value added")

        } catch (error) {
            console.log(error)
            toast.error("Error adding varaint value")
            dispatch(appLoadStop())
        }
    }
    const deleteVariantValue = async ({ callBack = () => { }, value_id }) => {
        try {

            if (!value_id) throw new Error();

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("product_variant_values")
                .delete()
                .eq("id", value_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ deleted_value_id: value_id })

            toast.success("Variant value deleted!")

        } catch (error) {
            console.log(error)
            toast.error("Error deleting variant value")
            dispatch(appLoadStop())
        }
    }
    const updateProduct = async ({ callBack = () => { }, product_id, update }) => {
        try {

            if (!product_id || !update) throw new Error();

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('products')
                .update(update)
                .eq("id", product_id)
                .select()
                .single()

            if (error) {
                console.log(error)
                throw new Error()
            }

            const updatedProducts = products?.map(p => {
                if (p?.id === product_id) {
                    return {
                        ...p,
                        ...update
                    }
                }

                return p
            })

            dispatch(appLoadStop())

            dispatch(setAdminState({ products: updatedProducts }))

            callBack && callBack({ update })

            toast.success("Product updated!")

        } catch (error) {
            console.log(error)
            toast.error("Error Updating product")
            dispatch(appLoadStop())
            callBack && callBack({ product: null })
        }
    }
    const fetchProductCategories = async ({ callBack = () => { } }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("product_categories")
                .select('*')

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(setAdminState({
                productCategories: data
            }))

            dispatch(appLoadStop())

            callBack && callBack()

        } catch (error) {
            console.log(error)
            toast.error("Error fetching product categories")
            dispatch(appLoadStop())
        }
    }
    const addProductCategory = async ({ callBack = () => { }, category }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('product_categories')
                .insert({
                    category
                })
                .select("*")
                .single()

            if (error) {
                console.log(error)
                throw new Error()
            }

            const pCats = [...(productCategories || []), data]

            dispatch(setAdminState({
                productCategories: pCats
            }))

            dispatch(appLoadStop())

            callBack && callBack({})

            toast.success("Product category added!")

        } catch (error) {
            console.log(error)
            toast.error("Error adding product category")
            dispatch(appLoadStop())
        }
    }
    const deleteProductCategory = async ({ callBack = () => { }, category }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('product_categories')
                .delete()
                .eq("category", category)

            if (error) {
                console.log(error)
                throw new Error()
            }

            const pCats = productCategories?.filter(c => c?.category?.toLowerCase() !== category?.toLowerCase())

            dispatch(setAdminState({
                productCategories: pCats
            }))

            dispatch(appLoadStop())

            callBack && callBack({})

            toast.success("Product category deleted!")

        } catch (error) {
            console.log(error)
            toast.error("Error deleting product category")
            dispatch(appLoadStop())
        }
    }
    const updateProductVisibility = async ({ callback = () => { }, product_visibility, product_id }) => {
        try {

            if ((product_visibility !== true && product_visibility !== false) || !product_id) throw new Error();

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("products")
                .update({
                    product_visibility
                })
                .eq("id", product_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            const updatedProducts = products?.map(p => {
                if (p?.id === product_id) {
                    return {
                        ...p,
                        product_visibility
                    }
                }

                return p
            })

            dispatch(setAdminState({
                products: updatedProducts
            }))

            dispatch(appLoadStop())

            callback && callback({})

            toast.success("Updated product visibility")

        } catch (error) {
            console.log(error)
            toast.error("Error updating product visibility")
            dispatch(appLoadStop())
        }
    }
    const deleteProductVariant = async ({ callBack = () => { }, variant_id, product_id }) => {
        try {

            if (!variant_id || !product_id) throw new Error();

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("product_variants")
                .delete()
                .eq("id", variant_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            const updatedProducts = products?.map(p => {
                if (p?.id === product_id) {
                    const updatedVariants = p?.product_variants?.filter(v => v?.id !== variant_id)

                    return {
                        ...p,
                        product_variants: updatedVariants
                    }
                }

                return p
            })

            dispatch(setAdminState({
                products: updatedProducts
            }))

            dispatch(appLoadStop())

            callBack && callBack({ variant_id })

            toast.success("Variant deleted!")

        } catch (error) {
            console.log(error)
            toast.error("Error deleting product variant")
            dispatch(appLoadStop())
        }
    }





    //providers
    const fetchProviderSpecialties = async ({ callback = () => { }, specialty, noLoad }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('provider_specialties')
                .select("*")

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(setAdminState({
                providerSpecialties: data
            }))

            dispatch(appLoadStop())

            callback && callback({})

        } catch (error) {
            console.log(error)
            toast.error("Error fetching provider specialty")
            dispatch(appLoadStop())
        }
    }
    const addProviderSpecialty = async ({ callBack = () => { }, specialty }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('provider_specialties')
                .insert({
                    specialty
                })
                .select()
                .single()

            if (error) {
                console.log(error)
                throw new Error()
            }

            const specialties = [...(providerSpecialties || []), data]

            dispatch(setAdminState({
                providerSpecialties: specialties
            }))

            dispatch(appLoadStop())

            callBack && callBack({})

            toast.success("Specialty added!")

        } catch (error) {
            console.log(error)
            toast.error("Error adding provider specialty")
            dispatch(appLoadStop())
        }
    }
    const deleteProviderSpecialty = async ({ callBack = () => { }, specialty }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("provider_specialties")
                .delete()
                .eq('specialty', specialty)

            if (error) {
                console.log(error)
                throw new Error()
            }

            const specialties = providerSpecialties?.filter(sp => sp?.specialty?.toLowerCase() !== specialty?.toLowerCase())

            dispatch(setAdminState({
                providerSpecialties: specialties
            }))

            dispatch(appLoadStop())

            callBack && callBack({})

            toast.success("Specialty deleted")

        } catch (error) {
            console.log(error)
            toast.error("Error deleting provider specialty")
            dispatch(appLoadStop())
        }
    }
    const fetchProviders = async ({ callBack = () => { }, }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("providers")
                .select(`
                    *,
                    license: providers_licenses ( * )    
                `)

            if (error) {
                console.log(error)
                throw new Error()
            }

            callBack && callBack({ providers: data })

            dispatch(appLoadStop())

        } catch (error) {
            console.log(error)
            toast.error("Error fetching providers")
            dispatch(appLoadStop())
        }
    }
    const fetchSingleProvider = async ({ callBack = () => { }, provider_id }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("providers")
                .select(`
                    *,
                    license: providers_licenses ( * )    
                `)
                .single()
                .eq("id", provider_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            callBack && callBack({ provider: data })

            dispatch(appLoadStop())

        } catch (error) {
            console.log(error)
            toast.error("Error fetching single provider")
            callBack && callBack({ provider: null })
            dispatch(appLoadStop())
        }
    }





    //orders
    const fetchOrders = async ({ callBack = () => { } }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items ( * ),
                    user_profile: user_id (*),
                    sessionInfo: checkout_sessions (*)
                `)
                .order("created_at", { ascending: false })

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ orders: data })

        } catch (error) {
            console.log(error)
            toast.error("Error fetching orders. Try again later!")

        } finally {
            dispatch(appLoadStop())
        }
    }
    const confirmOrder = async ({ callBack = () => { }, requestBody }) => {
        try {

            dispatch(appLoadStart())

            const { responseStatus, result, errorMsg } = await requestApi({
                url: 'https://tzsbbbxpdlupybfrgdbs.supabase.co/functions/v1/create-order',
                method: 'POST',
                data: requestBody
            })

            if (errorMsg) {
                dispatch(appLoadStop())
                toast.error(errorMsg)
                callBack && callBack({ errorMsg: errorMsg })
                return
            }

            if (result) {
                dispatch(appLoadStop())

                callBack && callBack({ confirmedOrder: result })

                toast.success("Order confirmed!")

                return;
            }

            throw new Error()

        } catch (error) {
            console.log(error)
            toast.error("Error confirming order. Try again later!")

        } finally {
            dispatch(appLoadStop())
        }
    }
    const updateOrder = async ({ callBack = () => { }, update, order_id, userName, user_id }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('orders')
                .update(update)
                .eq("id", order_id)
                .select()
                .single()

            if (error) {
                console.log(error)
                throw new Error()
            }

            if(userName && user_id){
                const { result, errorMsg } = await requestApi({
                    url: 'https://tzsbbbxpdlupybfrgdbs.supabase.co/functions/v1/retrieve-user-email',
                    method: 'POST',
                    data: {
                        user_id
                    }
                })

                if(!result || !result?.email){
                    console.log(errorMsg)
                    toast.info("Could not send mail to customer! But order-status has been updated in-app")
                }

                const sent = await sendEmail({
                    to_email: result?.email,
                    subject: 'Order status update',
                    data: {
                        userName
                    },
                    template_id: '3z0vklovx0vg7qrx'
                })

                if(!sent.sent){
                    toast.info("Could not send mail to customer! But order-status has been updated in-app")
                }
            }

            dispatch(appLoadStop())

            callBack && callBack({ status: data?.status, order_id, orderInfo: data })

            toast.success("Order updated")

        } catch (error) {
            console.log(error)
            toast.error("Error updating order!")

        } finally {
            dispatch(appLoadStop())
        }
    }





    //blogs
    const fetchBlogCategories = async ({ callBack = () => { } }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("blog_categories")
                .select("*")

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ categories: data })

        } catch (error) {
            console.log(error)
            toast.error("Error retrieving blog categories!")

        } finally {
            dispatch(appLoadStop())
        }
    }
    const addBlogCategory = async ({ callBack = () => { }, name }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('blog_categories')
                .insert({
                    name
                })
                .select()
                .single()

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ newCategory: data })

            toast.success("Blog category added!")

        } catch (error) {
            console.log(error)
            toast.error("Error adding blog category!")

        } finally {
            dispatch(appLoadStop())
        }
    }
    const deleteBlogCategory = async ({ callBack = () => { }, category_id }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("blog_categories")
                .delete()
                .eq("id", category_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ deleted_category_id: category_id })

            toast.success("Blog category deleted")

        } catch (error) {
            console.log(error)
            toast.error("Error deleting blog category!")

        } finally {
            dispatch(appLoadStop())
        }
    }





    //coupons
    const createCoupon = async ({ callBack = () => { }, requestInfo }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('coupons')
                .insert(requestInfo)

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({})

            toast.success("Coupon successfully created")

        } catch (error) {
            console.log(error)
            toast.error("Error creating coupon. Try again later!.")

        } finally {
            dispatch(appLoadStop())
        }
    }
    const editCoupon = async ({ callBack = () => { }, requestInfo, coupon_id }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('coupons')
                .update(requestInfo)
                .eq("id", coupon_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({})

            toast.success("Coupon successfully updated")

        } catch (error) {
            console.log(error)
            toast.error("Error updating coupon. Try again later!.")

        } finally {
            dispatch(appLoadStop())
        }
    }
    const fetchCoupons = async ({ callBack = () => { } }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("coupons")
                .select("*")

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ coupons: data })

        } catch (error) {
            console.log(error)
            toast.error("Error fetching coupons. Try again later!.")

        } finally {
            dispatch(appLoadStop())
        }
    }
    const fetchCouponsUsages = async ({ callBack = () => { } }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("coupon_usage")
                .select("*")

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ usage: data })

        } catch (error) {
            console.log(error)
            toast.error("Error fetching coupons usage. Try again later!.")

        } finally {
            dispatch(appLoadStop())
        }
    }





    //delivery
    const fetchWeightsDeliveryOptions = async ({ callBack = () => { } }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("weights_delivery_options")
                .select("*")

            const { data: destinations, error: destinationsError } = await supabase
                .from("delivery_destinations")
                .select("*")

            if (error || destinationsError) {
                console.log(error)
                console.log("destinationsError", destinationsError)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ options: data, destinations })

        } catch (error) {
            console.log(error)
            toast.error("Error weights-delivery-options. Try reloading the page.")

        } finally {
            dispatch(appLoadStop())
        }
    }
    const addWeightsDeliveryOption = async ({ callBack = () => { }, columns }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("weights_delivery_options")
                .upsert(
                    columns,
                    {
                        onConflict: 'destination'
                    }
                )
                .select()
                .single()

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ newWeightDeliveryOption: data })

            toast.success("Option saved!")

        } catch (error) {
            console.log(error)
            toast.error("Error adding weights-delivery-option. Try again later!.")

        } finally {
            dispatch(appLoadStop())
        }
    }
    const deleteWeightsDeliveryOption = async ({ callBack = () => { }, option_id }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("weights_delivery_options")
                .delete()
                .eq("id", option_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ deleted_option_id: option_id })

            toast.success("Option deleted")

        } catch (error) {
            console.log(error)
            toast.error("Error deleting weights-delivery-option. Try again later!.")

        } finally {
            dispatch(appLoadStop())
        }
    }
    const addDeliveryDestination = async ({ callBack = () => { }, columns }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("delivery_destinations")
                .insert(columns)
                .select("*")
                .single()

            if (error) {
                console.log(error)
                if (error.message.includes("duplicate")) {
                    return apiReqError({ errorMsg: 'Destination already exists!' })
                }
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ newDestination: data })

        } catch (error) {
            console.log(error)
            toast.error("Error adding delivery destination. Try again later!.")

        } finally {
            dispatch(appLoadStop())
        }
    }
    const deleteDeliveryDestination = async ({ callBack = () => { }, destination_id }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('delivery_destinations')
                .delete()
                .eq("id", destination_id)

            if (error) {
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ deleted_destination_id: destination_id })

        } catch (error) {
            console.log(error)
            toast.error("Error deleting delivery destination. Try again later!.")

        } finally {
            dispatch(appLoadStop())
        }
    }





    //users
    const fetchUserEmail = async ({ callBack = () => {}, user_id }) => {
        try {

            dispatch(appLoadStart())

            const { responseStatus, result, errorMsg } = await requestApi({
                url: 'https://tzsbbbxpdlupybfrgdbs.supabase.co/functions/v1/retrieve-user-email',
                method: 'POST',
                data: {
                    user_id
                }
            })

            if(!result){
                console.log(errorMsg)
                throw new Error()
            }

            const { email } = result

            if(!email){
                return apiReqError({ errorMsg: 'User email could not be retrieved! Try again later' })
            }

            dispatch(appLoadStop())

            callBack && callBack({ email })
            
        } catch (error) {
            console.log(error)
            toast.error("Error retrieving user email. Try again later!.")

        } finally {
            dispatch(appLoadStop())
        }
    }





    const apiReqError = ({ errorMsg }) => {
        toast.error(errorMsg)
        dispatch(appLoadStop())
    }





    return {
        //users
        loadMoreUsers,





        //mental health screening
        fetchTestResults,
        sendTestFeedBack,
        fetchAssignedProviders,
        fetchProviderAssignments,
        assignProvider,





        //bookings
        fetchBookings,
        fetchProviderBookings,





        //mothers
        fetchSingleMother,





        //providers
        fetchProviderSpecialties,
        addProviderSpecialty,
        deleteProviderSpecialty,
        fetchProviders,
        fetchSingleProvider,





        //services
        fetchServices,
        fetchVendorServices,
        fetchVendorServiceCategories,
        deleteVendorServiceCategory,
        addVendorServiceCategory,
        updateServiceType,
        insertServiceType,
        deleteServiceType,
        updateService,
        fetchSingleService,
        getServiceCategories,
        addService,





        //products
        fetchProducts,
        fetchProductCategories,
        addProductCategory,
        deleteProductCategory,
        updateProductVisibility,
        deleteProductVariant,
        fetchSingleProduct,
        updateProduct,
        addVariantType,
        deleteVariantType,
        addVariantValue,
        deleteVariantValue,
        addVariantsCombination,
        updateVarantCombinaton,
        fetchAllVariantTypesAndValues,





        //orders
        fetchOrders,
        confirmOrder,
        updateOrder,





        //blgs
        fetchBlogCategories,
        addBlogCategory,
        deleteBlogCategory,





        //coupons,
        createCoupon,
        editCoupon,
        fetchCoupons,
        fetchCouponsUsages,





        //delivery
        fetchWeightsDeliveryOptions,
        addWeightsDeliveryOption,
        deleteWeightsDeliveryOption,
        addDeliveryDestination,
        deleteDeliveryDestination,





        //users
        fetchUserEmail
    }
}