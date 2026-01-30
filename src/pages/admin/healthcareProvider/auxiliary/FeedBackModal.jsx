import { useEffect, useState } from "react";
import { isoToDateTime } from "../../../../lib/utils";
import { getRiskLevelBadge } from "../../../../lib/utils_Jsx";
import Modal from "../../components/ui/Modal";
import useApiReqs from "../../../../hooks/useApiReqs";
import ProductsModal from "../../components/ProductsModal";
import ProductCardSmall from "../../components/ui/ProductCardSmall";
import { toast } from "react-toastify";
import ProvidersModal from "../../components/ProvidersModal";
import ProviderCardSmall from "../../components/ui/ProviderCardSmall";
import ServicesModal from "../../components/ServicesModal";
import ServiceCardSmall from "../../components/ui/ServiceCardSmall";
import { useDispatch, useSelector } from "react-redux";
import { getAdminState, setAdminState } from "../../../../redux/slices/adminState";

export default function FeedBackModal({ modalProps }) {
    const dispatch = useDispatch()

    const { sendTestFeedBack } = useApiReqs()

    const mentalHealthScreenings = useSelector(state => getAdminState(state).mentalHealthScreenings)

    const [message, setMessage] = useState('')
    const [products, setProducts] = useState([])
    const [providers, setProviders] = useState([])
    const [services, setServices] = useState([])
    const [productsModal, setProductsModal] = useState({ visible: false, hide: null })
    const [providersModal, setProvidersModal] = useState({ visible: false, hide: null })
    const [servicesModal, setServicesModal] = useState({ visible: false, hide: null })

    // useEffect(() => {
    //     if (modalProps?.visible) {
    //         fetchProducts({
    //             callBack: ({ products }) => {
    //                 setProducts(products || [])
    //             }
    //         })
    //     }
    // }, [modalProps])

    if (!modalProps) return <></>

    const { data, visible, hide } = modalProps

    if (!data) return <></>

    const onHide = () => {
        setProducts([])
        setProviders([])
        setMessage('')

        hide && hide()
    }

    const openProductsModal = () => setProductsModal({ visible: true, hide: hideProductsModal })
    const hideProductsModal = () => setProductsModal({ visible: false, hide: null })

    const openProvidersModal = () => setProvidersModal({ visible: true, hide: hideProvidersModal })
    const hideProvidersModal = () => setProvidersModal({ visible: false, hide: null })

    const openServicesModal = () => setServicesModal({ visible: true, hide: hideServicesModal })
    const hideServicesModal = () => setServicesModal({ visible: false, hide: null })

    const onProductSelected = (product) => {
        const existingProductIds = products?.map(p => p?.id)

        if (existingProductIds?.includes(product?.id)) return;

        const updatedProducts = [...products, product]

        setProducts(updatedProducts)
    }

    const onProviderSelected = (provider) => {
        const existingProvidersIds = providers?.map(p => p?.provider_id)

        if (existingProvidersIds?.includes(provider?.provider_id)) return;

        const updatedProviders = [...providers, provider]

        setProviders(updatedProviders)        
    }

    const onServiceSelected = (service) => {
        const existingServicesIds = services?.map(s => s?.id)

        if (existingServicesIds?.includes(service?.id)) return;

        const updatedServices = [...services, service]

        setServices(updatedServices)        
    }    

    const sendFeedBack = () => {
        if (!message) return toast.info("Add a feedback message!");

        const requestInfo = {
            test_id: data?.id,
            message,
            type: 'mental_health_test',
            product_ids: products?.map(p => p?.id),
            service_ids: services?.map(s => s?.d),
            provider_ids: providers?.map(p => p?.provider_id),
            user_id: data?.user_profile?.id,
            title: 'Mental health test feedback'
        }

        sendTestFeedBack({
            callBack: ({ newFeedBack }) => {
                if(newFeedBack){
                    const updatedMentalHealthScreenings = mentalHealthScreenings?.map(MHS => {
                        if(MHS?.id === newFeedBack?.test_id){

                            const newTestFeedBack = [...(MHS?.test_feedback || []), newFeedBack]

                            return {
                                ...MHS,
                                test_feedback: newTestFeedBack
                            }
                        }

                        return MHS
                    })

                    dispatch(setAdminState({ mentalHealthScreenings: updatedMentalHealthScreenings }))
                }

                modalProps?.hide && modalProps?.hide()
            },
            requestInfo,
            user_id: data?.user_profile?.id
        })
    }

    return (
        <Modal
            isOpen={visible}
            onClose={onHide}
        >
            <div className="flex items-center justify-between border-b border-gray-200 mb-5 py-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    Send feedback to: {data?.user_profile?.name}
                </h2>
            </div>

            {
                [
                    { title: 'Submission date', value: `${data?.created_at ? isoToDateTime({ isoString: data?.created_at }) : 'Not set'}` },
                    { title: 'Remark', value: data?.remark },
                    { title: 'Risk Level', value: getRiskLevelBadge(data?.risk_level) },
                ]
                    ?.map((info, i) => {
                        const { title, value } = info

                        return (
                            <div key={i} className="flex items-center justify-between gap-2 mb-4">
                                <h3 className="">
                                    {title}
                                </h3>

                                <div className="w-3/5 flex items-center justify-end text-end">
                                    {value}
                                </div>
                            </div>
                        )
                    })
            }

            <div className="py-1" />

            <div className="flex flex-col space-y-2 w-full mb-10">
                <label className="text-gray-700 font-medium">Message <sup className="text-red-600 text-lg font-bold px-1">*</sup></label>
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    placeholder="A message for the mother"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                        minWidth: '100%',
                        minHeight: '150px'
                    }}
                />
            </div>

            <h2 className="mb-3 text-lg">
                Recommendations
            </h2>

            <div className="mb-5">
                <p className="text-md">
                    Products
                </p>

                <button
                    onClick={openProductsModal}
                    className="my-4 px-3 py-1 text-white rounded-lg"
                    style={{
                        backgroundColor: '#703DCB', borderColor: '#703DCB',
                        borderRadius: '10px'
                    }}
                >
                    Add
                </button>

                {
                    products?.length > 0
                    &&
                    <div className="flex items-center flex-wrap">
                        {
                            products?.map((p, i) => {

                                const removeProduct = (product) => {
                                    const updatedProducts = products?.filter(p => p?.id !== product?.id)
                                    setProducts(updatedProducts)
                                }

                                return (
                                    <div key={i} className="lg:w-1/2 w-full px-2 mb-4">
                                        <ProductCardSmall
                                            product={p}
                                            onDelete={removeProduct}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>

            <hr />
            <div className="mb-5" />

            <div className="mb-5">
                <p className="text-md">
                    Providers
                </p>

                <button
                    onClick={openProvidersModal}
                    className="my-4 px-3 py-1 text-white rounded-lg"
                    style={{
                        backgroundColor: '#703DCB', borderColor: '#703DCB',
                        borderRadius: '10px'
                    }}
                >
                    Add
                </button>

                {
                    providers?.length > 0
                    &&
                    <div className="flex items-stretch flex-wrap">
                        {
                            providers?.map((p, i) => {

                                const removeProvider = (provider) => {
                                    const updatedProviders = providers?.filter(p => p?.provider_id !== provider?.provider_id)
                                    setProviders(updatedProviders)
                                }

                                return (
                                    <div key={i} className="lg:w-1/2 w-full px-2 mb-4">
                                        <ProviderCardSmall
                                            provider={p}
                                            onDelete={removeProvider}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>

            <hr />
            <div className="mb-5" />

            <div className="mb-5">
                <p className="text-md">
                    Services
                </p>

                <button
                    onClick={openServicesModal}
                    className="my-4 px-3 py-1 text-white rounded-lg"
                    style={{
                        backgroundColor: '#703DCB', borderColor: '#703DCB',
                        borderRadius: '10px'
                    }}
                >
                    Add
                </button>

                {
                    services?.length > 0
                    &&
                    <div className="flex items-stretch flex-wrap">
                        {
                            services?.map((s, i) => {

                                const removeService = (service) => {
                                    const updatedServices = services?.filter(s => s?.id !== service?.id)
                                    setServices(updatedServices)
                                }

                                return (
                                    <div key={i} className="lg:w-1/2 w-full px-2 mb-4">
                                        <ServiceCardSmall
                                            service={s}
                                            onDelete={removeService}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>            


            <div className="mt-10" />

            <button
                onClick={sendFeedBack}
                className="my-4 px-3 py-1 text-white rounded-lg w-full"
                style={{
                    backgroundColor: '#703DCB', borderColor: '#703DCB',
                    borderRadius: '10px'
                }}
            >
                Send
            </button>

            <ProductsModal
                modalProps={productsModal}
                onProductSelected={onProductSelected}
                selectedProductIds={products?.map(p => p?.id)}
            />

            <ProvidersModal 
                modalProps={providersModal}
                onProviderSelected={onProviderSelected}
                selectedProvidersIds={providers?.map(p => p?.provider_id)}
            />

            <ServicesModal 
                modalProps={servicesModal}
                onServiceSelected={onServiceSelected}
                selectedServicesIds={services?.map(s => s?.id)}            
            />
        </Modal>
    )
}