import { useEffect, useState } from "react";
import { formatNumberWithCommas } from "../../../lib/utils";
import Carousel from "../components/ui/Carousel";
import { getPublicImageUrl } from "../../../lib/requestApi";
import { ProductVariantsDisplay } from "./ProductsVariantsDisplay";
import Modal from "../components/ui/Modal";
import { Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { countries, states } from "../../../constants/locationConstants";
import ErrorMsg1 from "../components/ErrorMsg1";
import useApiReqs from "../../../hooks/useApiReqs";
import { toast } from "react-toastify";
import { orderStatuses } from "../../../constants/orderConstants";
// import ProductPreview from "../products/ProductPreview";

export default function SingleOrder({ visible, order, orders = [], setOrders = () => { } }) {

    const { confirmOrder, updateOrder } = useApiReqs()

    const [previewedProduct, setPreviewedProduct] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false)
    const [singleOrder, setSingleOrrder] = useState(order)

    useEffect(() => {
        const o = orders?.filter(ord => ord?.id === order?.id)?.[0]
        setSingleOrrder(o)
    }, [orders])

    if (!singleOrder?.order_items) return null;

    const handleConfirmOrder = ({ pickUpState, pickUpAddress }) => {
        // recipientAddress, recipientState, recipientName, recipientPhone, recipientEmail, uniqueID, batchId, valueOfItem, weight, pickUpState, pickUpAddress, fragile
        const address = order?.shipping_address?.address
        const state = order?.shipping_address?.state

        const phoneData = order?.user_profile?.unique_phones

        const phoneNumber = phoneData && `${phoneData?.country_code}${phoneData?.phone_number}`

        const requestBody = {
            recipientAddress: address,
            recipientState: state?.replaceAll("_", " "),
            recipientName: order?.user_profile?.name,
            recipientPhone: phoneNumber,
            // recipientEmail: 
            valueOfItem: order?.total_price,
            weight: 65, // dummy for now
            pickUpState,
            pickUpAddress,
            fragile: order?.variant_info?.fragile || false
        }

        confirmOrder({
            callBack: ({ confirmedOrder, errorMsg }) => {
                if (confirmedOrder) {
                    console.log(confirmedOrder)
                }

                if (errorMsg) {
                    toast.error(errorMsg?.description || 'Unexpected error! Try again later')
                }
            },
            requestBody
        })
    }

    const updateOrderStatus = (status) => {
        const update = { status }

        updateOrder({
            callBack: ({ }) => {
                const updatedOrders = orders?.map(ord => {
                    if (ord?.id === order?.id) {
                        return {
                            ...ord,
                            status
                        }
                    }

                    return ord
                })

                setOrders(updatedOrders)
            },
            update,
            order_id: order?.id
        })
    }

    return (
        <>
            {/* Collapse wrapper */}
            <div className={`${visible ? "block" : "hidden"} transition-all`}>
                <div className="flex flex-wrap -mx-1">
                    {singleOrder.order_items.map((item, idx) => {

                        const image_urls =
                            item?.product_info?.product_images?.map((imgPath) =>
                                getPublicImageUrl({ path: imgPath, bucket_name: "admin_products" })
                            );

                        return (
                            <div key={idx} className="w-full lg:w-1/2 px-1 mb-3">
                                <div className="bg-white shadow-lg rounded-lg p-3">
                                    <div className="flex flex-wrap items-center gap-5 mb-3">
                                        <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Carousel
                                                slides={image_urls?.map((url, i) => {
                                                    return {
                                                        src: url,
                                                        alt: `product-img-${i}`
                                                    }
                                                })}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="mb-2 font-bold text-gray-900">
                                                {item?.product_info?.product_name}
                                            </h4>
                                            <div className="text-gray-900 font-semibold">
                                                {order?.currency}{" "}
                                                {formatNumberWithCommas(item?.unit_price * item.quantity)}
                                            </div>
                                            <hr className="my-2 border-gray-200" />
                                            <div className="flex gap-2 items-center">
                                                <p className="fw-bold text-sm text-gray-500">
                                                    Quantity
                                                </p>
                                                <p className="fw-bold text-sm text-gray-700">
                                                    {item?.quantity}
                                                </p>
                                            </div>
                                            <div className="flex items-start justify-start flex-col">
                                                <ProductVariantsDisplay
                                                    variants={item?.variant_info?.options}
                                                />
                                            </div>
                                            <hr className="my-2 border-gray-200" />
                                            <div className="flex flex-col gap-0 mb-2">
                                                <p className="fw-bold text-sm text-gray-500">
                                                    By:
                                                </p>
                                                <p className="fw-bold text-sm text-gray-700">
                                                    {order?.user_profile?.name || 'Deleted account'}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-0">
                                                <p className="fw-bold text-sm text-gray-500">
                                                    Shipped to:
                                                </p>
                                                <p className="fw-bold text-sm text-gray-700">
                                                    {order?.shipping_address?.country} {order?.shipping_address?.state} {order?.shipping_address?.city} {order?.shipping_address?.address}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Action Button */}
                {
                    singleOrder?.status === 'placed'
                        ?
                        <button
                            onClick={() => updateOrderStatus('confirmed')}
                            className="cursor-pointer border border-gray-300 text-gray-700 rounded-md px-4 py-2 text-sm hover:bg-gray-50 transition"
                        >
                            Confirm Order
                        </button>
                        :
                        <div>
                            <Formik
                                validationSchema={yup.object().shape({
                                    status: yup.string().required("Order status is required"),
                                    tracking_id: yup.string(),
                                    tracking_link: yup.string().url("Enter a valid URL"),
                                    additional_text: yup.string()
                                })}
                                initialValues={{
                                    status: '',
                                    tracking_id: '',
                                    tracking_link: '',
                                    additional_text: ''
                                }}
                                onSubmit={(values, { resetForm }) => {

                                    const update = {
                                        status: values?.status || singleOrder?.status,
                                        tracking_id: values?.tracking_id || singleOrder?.tracking_id,
                                        tracking_link: values?.tracking_link || singleOrder?.tracking_link,
                                        additional_text: values?.additional_text || singleOrder?.additional_text,
                                    }

                                    updateOrder({
                                        callBack: ({ }) => { },
                                        order_id: order?.id,
                                        update
                                    })

                                    resetForm()
                                }}
                            >
                                {({ values, handleBlur, handleChange, handleSubmit }) => (
                                    <div>
                                        <div className="flex flex-col mb-3">
                                            <label className="text-gray-700 font-medium">Tracking ID ({singleOrder?.tracking_id || 'if any'})</label>
                                            <input
                                                value={values.tracking_id}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="tracking_id"
                                                placeholder="**********"
                                                required
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            />
                                            <ErrorMessage name="tracking_id">
                                                {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                            </ErrorMessage>
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="text-gray-700 font-medium">Tracking Link ({singleOrder?.tracking_link || 'if any'})</label>
                                            <input
                                                value={values.tracking_link}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="tracking_link"
                                                placeholder="https://tracker.com"
                                                required
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            />
                                            <ErrorMessage name="tracking_link">
                                                {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                            </ErrorMessage>
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="text-gray-700 font-medium">Additional Info ({singleOrder?.additional_text || 'brief text for user clarification'})</label>
                                            <input
                                                value={values.additional_text}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="additional_text"
                                                placeholder="Just arrived at..."
                                                required
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            />
                                            <ErrorMessage name="additional_text">
                                                {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                            </ErrorMessage>
                                        </div>
                                        <div className="flex flex-col mb-5">
                                            <label className="text-gray-700 font-medium">Order status ({singleOrder?.status || 'Status not set'})</label>
                                            <select
                                                value={values.status}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name="status"
                                                required
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            >
                                                <option value="">Status</option>
                                                {
                                                    orderStatuses.map((o_status, i) => {
                                                        return (
                                                            <option key={i} value={o_status}>
                                                                {o_status}
                                                            </option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            <ErrorMessage name="status">
                                                {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                            </ErrorMessage>
                                        </div>
                                        <button
                                            onClick={handleSubmit}
                                            className="cursor-pointer my-4 px-3 py-1 text-white rounded-lg"
                                            style={{
                                                backgroundColor: '#703DCB', borderColor: '#703DCB',
                                                borderRadius: '10px',
                                            }}
                                        >
                                            Update order
                                        </button>
                                    </div>
                                )}
                            </Formik>
                        </div>
                }
            </div>


            <Modal
                onClose={() => setShowConfirm(false)}
                isOpen={showConfirm}
            >
                <div className="flex items-center justify-between border-b border-gray-200 mb-5 py-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Order confirmation
                    </h2>
                </div>

                <Formik
                    validationSchema={yup.object().shape({
                        pickUpAddress: yup.string().required("Pick up address is required"),
                        pickUpState: yup.string().required("Pick up state is required"),
                        pickUpCountry: yup.string().required("Pick up country is required"),
                    })}
                    initialValues={{
                        pickUpCountry: '',
                        pickUpState: '',
                        pickUpAddress: '',
                    }}
                    onSubmit={(values, { resetForm }) => {
                        handleConfirmOrder({
                            pickUpState: values.pickUpState,
                            pickUpAddress: values.pickUpAddress
                        })

                        // resetForm()

                        // setShowConfirm(false)
                    }}
                >
                    {({ handleBlur, handleChange, handleSubmit, isValid, dirty, values }) => (
                        <div>
                            <div className="flex flex-col mb-3">
                                <label
                                    htmlFor="variantTypeId"
                                    className="text-base font-medium text-gray-700 mb-1"
                                >
                                    Pick up country
                                </label>
                                <select
                                    value={values.pickUpCountry}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="pickUpCountry"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                >
                                    <option value="">Pick up country</option>
                                    {
                                        countries.map((c, i) => {
                                            return (
                                                <option key={i} value={c.value}>
                                                    {c.title}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                <ErrorMessage name="pickUpCountry">
                                    {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                </ErrorMessage>
                            </div>

                            {
                                values?.pickUpCountry
                                &&
                                <div className="flex flex-col mb-3">
                                    <label
                                        htmlFor="variantTypeId"
                                        className="text-base font-medium text-gray-700 mb-1"
                                    >
                                        Pick up state
                                    </label>
                                    <select
                                        value={values.pickUpState}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="pickUpState"
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    >
                                        <option value="">Pick up state</option>
                                        {
                                            states.filter(s => s?.country === values?.pickUpCountry)?.map((s, i) => {
                                                return (
                                                    <option key={i} value={s.title}>
                                                        {s.title}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                    <ErrorMessage name="pickUpState">
                                        {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                    </ErrorMessage>
                                </div>
                            }

                            {
                                values?.pickUpCountry && values?.pickUpState
                                &&
                                <div className="flex flex-col mb-5">
                                    <label className="text-gray-700 font-medium">Pick up address</label>
                                    <input
                                        value={values.pickUpAddress}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="pickUpAddress"
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="pickUpAddress">
                                        {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                    </ErrorMessage>
                                </div>
                            }

                            {
                                values?.pickUpAddress
                                &&
                                <button
                                    onClick={handleSubmit}
                                    disabled={!(isValid && dirty) ? true : false}
                                    className="cursor-pointer my-4 px-3 py-1 text-white rounded-lg"
                                    style={{
                                        backgroundColor: '#703DCB', borderColor: '#703DCB',
                                        borderRadius: '10px',
                                        opacity: !(isValid && dirty) ? 0.5 : 1
                                    }}
                                >
                                    Confirm order
                                </button>
                            }
                        </div>
                    )}
                </Formik>
            </Modal>

        </>
    );
}
