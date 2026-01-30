import { ErrorMessage, Formik } from "formik";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as yup from 'yup'
import ErrorMsg1 from "../../components/ErrorMsg1";
import Modal from "../../components/ui/Modal";
import { currencies } from "../../../../lib/currencies";
import { splitSeconds } from "../../../../lib/utils";

const minDuration = 15 * 60

const ServiceType = ({
    isOpen,
    hide,
    info = {},
    continueBtnText,
    handleContinueBtnClick = () => { }
}) => {

    return (
        <>
            {isOpen && (
                <Formik
                    enableReinitialize
                    validationSchema={
                        yup.object().shape({
                            // pricing_type: yup.string().required('Pricing type is required'),
                            is_virtual: yup
                                .boolean()
                                .required("Please specify if this service is virtual"),
                            currency: yup.string().required("Currency is required"),
                            description: yup.string().notRequired(),
                            price: yup.string().matches(/^[0-9]+$/, "Only numbers are allowed").required("Price is required"),
                            duration_hour: yup
                                .number(),

                            duration_minutes: yup
                                .number()
                                .max(59, "Minutes cannot exceed 59"),
                        })
                    }
                    initialValues={{
                        currency: info?.currency,
                        price: info?.price,
                        description: info?.description,
                        duration_hour: splitSeconds(info?.duration)?.hour,
                        duration_minutes: splitSeconds(info?.duration)?.minutes,
                        is_virtual: info?.is_virtual || false
                    }}
                    onSubmit={(values, { resetForm }) => {
                        const hourSecs = (values.duration_hour ? (Number(values.duration_hour) * 60 * 60) : 0)
                        const minSecs = (values.duration_minutes ? (Number(values.duration_minutes) * 60) : 0)

                        const duration = hourSecs + minSecs

                        if (isNaN(duration)) return toast.error("Duration inputs are invalid, recheck!");

                        if (duration < minDuration) return toast.error("Duration must be at least 15mins!");

                        const requestInfo = {
                            currency: values.currency,
                            price: values.price,
                            duration,
                            description: values.description,
                            is_virtual: values?.is_virtual
                        }

                        handleContinueBtnClick({
                            requestInfo,
                            info
                        })

                        // resetForm()
                    }}
                >
                    {({ handleBlur, handleChange, handleSubmit, values, setFieldValue }) => (
                        <Modal
                            isOpen={true}
                            onClose={hide}
                        >
                            <h2 className={`text-lg font-semibold text-center text-grey-800 mb-5`}>
                                Set Pricing && Fees
                            </h2>

                            <div className="space-y-4">
                                {/* <div>
                                    <label className="block text-sm font-medium">Pricing type</label>
                                    <select 
                                        name="pricing_type"
                                        value={values.pricing_type}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none"
                                    >
                                        <option value={""} disabled selected>Select</option>
                                        <option value={'fixed'}>Fixed</option>
                                        <option value={'hourly'}>Hourly</option>
                                    </select>
                                    <ErrorMessage name="pricing_type">
                                        { errorMsg => <ErrorMsg1 errorMsg={errorMsg} /> }
                                    </ErrorMessage>
                                </div> */}

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="is_virtual"
                                        checked={values.is_virtual || false}
                                        onChange={e => {
                                            setFieldValue("is_virtual", e.target.checked)
                                        }}
                                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <label className="text-sm font-medium">This is a virtual service</label>
                                    <ErrorMessage name="is_virtual">
                                        {errorMsg => <ErrorMsg1 className="mb-7" errorMsg={errorMsg} />}
                                    </ErrorMessage>
                                </div>                                

                                <div>
                                    <label className="block text-sm font-medium">Currency</label>
                                    <select
                                        name="currency"
                                        value={values.currency}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none"
                                    >
                                        <option value={""} disabled selected>Select</option>
                                        {
                                            currencies.map((c, cIndex) => (
                                                <option
                                                    key={cIndex}
                                                    value={c?.value}
                                                >
                                                    {c?.title}
                                                </option>
                                            ))
                                        }
                                    </select>
                                    <ErrorMessage name="currency">
                                        {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                    </ErrorMessage>
                                </div>

                                <div className="">
                                    <label className="block text-sm font-medium">Hour duration</label>
                                    <input
                                        name="duration_hour"
                                        value={values.duration_hour}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none"
                                    />
                                    <ErrorMessage name="duration_hour">
                                        {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                    </ErrorMessage>
                                </div>

                                <div className="">
                                    <label className="block text-sm font-medium">Additional minutes</label>
                                    <input
                                        name="duration_minutes"
                                        value={values.duration_minutes}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none"
                                    />
                                    <ErrorMessage name="duration_minutes">
                                        {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                    </ErrorMessage>
                                </div>

                                <div className="">
                                    <label className="block text-sm font-medium">Price</label>
                                    <input
                                        name="price"
                                        value={values.price}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none"
                                    />
                                    <ErrorMessage name="price">
                                        {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                    </ErrorMessage>
                                </div>

                                <div className="">
                                    <label className="block text-sm font-medium">Description {'(optional)'}</label>
                                    <textarea
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        type="text"
                                        placeholder="Short description"
                                        className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none"
                                        style={{
                                            minHeight: '200px',
                                            minWidth: '100%'
                                        }}
                                    />
                                    <ErrorMessage name="description">
                                        {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                    </ErrorMessage>
                                </div>                                

                                <button
                                    onClick={handleSubmit}
                                    className={`cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-4xl`}
                                >
                                    Save
                                </button>
                            </div>
                        </Modal>
                    )}
                </Formik >
            )}
        </>
    )
}

export default ServiceType