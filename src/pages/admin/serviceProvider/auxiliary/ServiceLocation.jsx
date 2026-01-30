import { ErrorMessage, Formik } from "formik";
import React, { useState } from "react";
import { GoGlobe } from "react-icons/go";
import * as yup from 'yup'
import InputGroup from "../../components/ui/InputGroup";
import Modal from "../../components/ui/Modal";
import ErrorMsg1 from "../../components/ErrorMsg1";

const minDuration = 15 * 60

const ServiceLocation = ({
    isOpen,
    hide,
    info = {},
    handleContinueBtnClick = () => { }
}) => {

    return (
        <Formik
            enableReinitialize
            validationSchema={
                yup.object().shape({
                    country: yup.string().required("Country is required"),
                    state: yup.string().required("State is required"),
                    city: yup.string().required("City is required"),
                    address: yup.string().required("Address is required"),
                })
            }
            initialValues={{
                country: info?.country || "",
                state: info?.state || "",
                city: info?.city || "",
                address: info?.address || "",
            }}
            onSubmit={values => {
                const requestInfo = values

                handleContinueBtnClick({
                    requestInfo: values,
                    info
                })
            }}
        >
            {({ handleBlur, handleChange, handleSubmit, values, setFieldValue }) => (
                <Modal
                    isOpen={isOpen}
                    onClose={hide}
                >
                    {/* Title */}
                    <h2 className={`text-lg font-semibold text-center text-grey-800`}>
                        Set Pricing & Duration
                    </h2>

                    <div className="space-y-4">
                        {/* Country */}
                        <InputGroup label="Country" icon={GoGlobe}>
                            <input
                                value={values.country}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="country"
                                placeholder="Country"
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
                            />
                            <ErrorMessage name="country">
                                {errorMsg => <ErrorMsg1 className="mb-7" errorMsg={errorMsg} />}
                            </ErrorMessage>
                        </InputGroup>

                        {/* State */}
                        <InputGroup label="State">
                            <input
                                value={values.state}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="state"
                                placeholder="State"
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
                            />
                            <ErrorMessage name="state">
                                {errorMsg => <ErrorMsg1 className="mb-7" errorMsg={errorMsg} />}
                            </ErrorMessage>
                        </InputGroup>

                        {/* City */}
                        <InputGroup label="City / LGA">
                            <input
                                value={values.city}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="city"
                                placeholder="City/Local Govt Area"
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
                            />
                            <ErrorMessage name="city">
                                {errorMsg => <ErrorMsg1 className="mb-7" errorMsg={errorMsg} />}
                            </ErrorMessage>
                        </InputGroup>

                        {/* Specific Address */}
                        <InputGroup label="Specific Address">
                            <input
                                placeholder="Address"
                                name="address"
                                value={values.address}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
                            />
                            <ErrorMessage name="address">
                                {errorMsg => <ErrorMsg1 className="mb-7" errorMsg={errorMsg} />}
                            </ErrorMessage>
                        </InputGroup>

                        <button
                            onClick={handleSubmit}
                            className={` cursor-pointer ${"px-4 py-2 bg-primary-600 text-white rounded-4xl"}`}
                        >
                            Save
                        </button>
                    </div>
                </Modal>
            )}
        </Formik>
    )
}

export default ServiceLocation