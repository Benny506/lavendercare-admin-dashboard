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
                    test_feedback: test_feedback(*)
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
    const sendTestFeedBack = async ({ callBack = () => {}, requestInfo, user_id }) => {
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

            if(!email) throw new Error();

            //use email to send mail. Create template!

            const { data, error } = await supabase
                .from('test_feedback')
                .insert(requestInfo)
                .select()
                .single()

            if(error){
                console.log(error)
                throw new Error();
            }

            const updatedScreens = (mentalHealthScreenings || [])?.map(sc => {
                if(sc?.id === requestInfo?.test_id){
                    return {
                        ...sc,
                        feedback_sent: true
                    }
                }

                return sc
            })

            dispatch(setAdminState({ mentalHealthScreenings: updatedScreens }))

            dispatch(appLoadStop())

            callBack && callBack({})

            toast.success("Feedback sent to mother")
            
        } catch (error) {
            console.log(error)
            toast.error("Error sending test feed-back, try again later")
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
                    *,
                    product_variant_types ( * )
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
                    product_variant_types ( 
                        *,
                        product_variant_values ( * )
                    ),
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
    const addVariantsCombination = async ({ callBack = () => { }, product_id, price_value, price_currency, stock, options }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('product_variants_combinations')
                .insert({
                    product_id,
                    price_value,
                    price_currency,
                    stock,
                    options
                })
                .select()
                .single()

            if (error) {
                if (error.message?.toLowerCase().includes("duplicate key")) {
                    dispatch(appLoadStop())
                    return toast.error("Variants combination already exists for this product")
                }
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
    const addVariantType = async ({ callBack = () => { }, product_id, name }) => {
        try {

            if (!product_id || !name) throw new Error();

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from("product_variant_types")
                .insert({
                    name,
                    product_id
                })
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

            callBack && callBack({ newVariant: data })

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





    //orders
    const fetchOrders = async ({ callBack = () => { } }) => {
        try {

            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items ( * ),
                    user_profile: user_id ( 
                        *,
                        unique_phones ( * )
                    )
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
    const updateOrder = async ({ callBack = () => {}, update, order_id }) => {
        try {
            
            dispatch(appLoadStart())

            const { data, error } = await supabase
                .from('orders')
                .update(update)
                .eq("id", order_id)
                .select()
                .single()

            if(error){
                console.log(error)
                throw new Error()
            }

            dispatch(appLoadStop())

            callBack && callBack({ status, order_id })

            toast.success("Order updated")
            
        } catch (error) {
            console.log(error)
            toast.error("Error updating order!")

        } finally {
            dispatch(appLoadStop())
        }
    }





    return {
        //users
        loadMoreUsers,





        //mental health screening
        fetchTestResults,
        sendTestFeedBack,





        //bookings
        fetchBookings,





        //mothers
        // fetchMotherBookings,





        //providers
        fetchProviderSpecialties,
        addProviderSpecialty,
        deleteProviderSpecialty,





        //vendors
        fetchVendorServices,
        fetchVendorServiceCategories,
        deleteVendorServiceCategory,
        addVendorServiceCategory,





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





        //orders
        fetchOrders,
        confirmOrder,
        updateOrder
    }
}