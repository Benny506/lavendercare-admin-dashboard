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
import { ErrorMessage, Formik } from "formik";
import * as yup from 'yup'
import ErrorMsg1 from "../ErrorMsg1";

// notification types 
// 1. info -> GENERAL INFORMATION. UPDATES. E.T.C

const notificationCategories = [
    {
        category: 'general',
        title: 'General'
    },
    // {
    //     category: 'order',
    //     title: 'Orders'
    // },
    // {
    //     category: 'appointment',
    //     title: 'Appointments'
    // },
]

export default function NotifyModal({ modalProps }) {
    const dispatch = useDispatch()

    const { sendNotification } = useApiReqs()

    const mentalHealthScreenings = useSelector(state => getAdminState(state).mentalHealthScreenings)

    const [products, setProducts] = useState([])
    const [providers, setProviders] = useState([])
    const [services, setServices] = useState([])
    const [productsModal, setProductsModal] = useState({ visible: false, hide: null })
    const [providersModal, setProvidersModal] = useState({ visible: false, hide: null })
    const [servicesModal, setServicesModal] = useState({ visible: false, hide: null })

    if (!modalProps) return <></>

    const { data, visible, hide } = modalProps

    const onHide = () => {
        setProducts([])
        setProviders([])

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

    return (
        <Modal
            isOpen={visible}
            onClose={onHide}
        >
            <div className="flex items-center justify-between border-b border-gray-200 mb-5 py-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    Notify
                </h2>
            </div>

            <div className="py-1" />

            <Formik
                validationSchema={yup.object().shape({
                    message: yup.string().required("Message is required"),
                    title: yup.string().required("Title is required"),
                    category: yup.string().required("Category is required"),
                })}
                initialValues={{
                    message: '', title: '', category: ''
                }}
                onSubmit={(values, { resetForm }) => {

                    const { message, title, category } = values

                    const notificationInfo = {
                        title,
                        message,
                        category,
                        type: 'general'
                    }

                    sendNotification({
                        callBack: ({ }) => {
                            resetForm()
                            modalProps?.hide && modalProps?.hide()
                        },
                        notificationInfo
                    })
                }}
            >
                {({ handleBlur, handleChange, handleSubmit, values }) => (
                    <>
                        <div className="mb-10">
                            <div className="flex flex-col space-y-2 w-full mb-5">
                                <label className="text-gray-700 font-medium">Category <sup className="text-red-600 text-lg font-bold px-1">*</sup></label>
                                <select
                                    name="category"
                                    value={values.category}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Title"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={""}>
                                        Select one
                                    </option>
                                    {
                                        notificationCategories?.map(cat => {
                                            const { title, category } = cat

                                            return (
                                                <option value={category}>
                                                    {title}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                <ErrorMessage name="category">
                                    {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                </ErrorMessage>
                            </div>

                            <div className="flex flex-col space-y-2 w-full mb-5">
                                <label className="text-gray-700 font-medium">Title <sup className="text-red-600 text-lg font-bold px-1">*</sup></label>
                                <input
                                    name="title"
                                    value={values.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Title"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="title">
                                    {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                </ErrorMessage>
                            </div>

                            <div className="flex flex-col space-y-2 w-full mb-5">
                                <label className="text-gray-700 font-medium">Message <sup className="text-red-600 text-lg font-bold px-1">*</sup></label>
                                <textarea
                                    name="message"
                                    value={values.message}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder={`Message`}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={{
                                        minWidth: '100%',
                                        minHeight: '150px'
                                    }}
                                />
                                <ErrorMessage name="message">
                                    {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                </ErrorMessage>
                            </div>
                        </div>



                        <div className="mt-10" />

                        <button
                            onClick={handleSubmit}
                            className="my-4 px-3 py-1 text-white rounded-lg w-full"
                            style={{
                                backgroundColor: '#703DCB', borderColor: '#703DCB',
                                borderRadius: '10px'
                            }}
                        >
                            Send
                        </button>
                    </>

                )}
            </Formik>

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