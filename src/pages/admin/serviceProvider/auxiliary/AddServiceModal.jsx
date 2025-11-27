import { ErrorMessage, Formik } from "formik";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as yup from 'yup'
import { countries, states, NigerianCities } from "../../../../constants/locationConstants";
import ErrorMsg1 from "../../components/ErrorMsg1";
import Modal from "../../components/ui/Modal";
import supabase from "../../../../database/dbInit";

export default function AddServiceModal({
    isOpen = false,
    hide = () => { },
    goBackBtnFunc = null,
    continueBtnFunc = null,
    info = {},
    setApiReqs = () => { },
}) {

    const [allServices, setAllServices] = useState([])

    useEffect(() => {
        if (isOpen) {
            setApiReqs && setApiReqs({ isLoading: true, errorMsg: null, data: null })
            loadServices()
        }
    }, [isOpen])

    const loadServices = async () => {
        try {

            const { data, error } = await supabase
                .from("vendor_service_categories")
                .select("*")

            if (error) {
                console.log(error)
                throw new Error()
            }

            setAllServices(data)

        } catch (error) {
            console.log(error)
            toast.error("Error loading services")

        } finally {
            setApiReqs({ isLoading: false, errorMsg: null, data: null })
        }
    }

    return (
        <div>
            {isOpen && (
                <>
                    <Formik
                        validationSchema={yup.object().shape({
                            service_name: yup.string().required("Service name is required"),
                            service_category: yup.string().required("Service category is required"),
                            service_details: yup.string().required("Service details is required"),
                            location: yup.string().required("Service location is required"),
                            country: yup.string().required("Country is required"),
                            city: yup.string().required("City is required"),
                            state: yup.string().required("State is required")
                        })}
                        initialValues={{
                            service_name: info?.service_name || '',
                            service_category: info?.service_category || '',
                            service_details: info?.service_details || '',
                            location: info?.location || '',
                            country: info?.country || '',
                            city: info?.city || '',
                            state: info?.state || '',
                        }}
                        onSubmit={(values) => {
                            continueBtnFunc && continueBtnFunc(values)
                        }}
                    >
                        {({ values, isValid, dirty, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
                            <Modal
                                isOpen={isOpen}
                                onClose={hide}
                            >
                                <h2 className={`text-lg font-semibold text-center text-grey-800`}>
                                    Service details
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-grey-600 mb-1">Service Name {info?.service_name && 'Cannot change service name after creation'}</label>
                                        <input
                                            disabled={info?.service_name ? true : false}
                                            name="service_name"
                                            value={values.service_name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            placeholder="e.g Deep tissue massage"
                                            className="w-full border border-grey-300 rounded-md p-2"
                                        />
                                        <ErrorMessage name="service_name">
                                            {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                        </ErrorMessage>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-grey-600 mb-1">Country</label>
                                        <select
                                            name="country"
                                            value={values.country}
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                setFieldValue("state", "")
                                                setFieldValue("city", "")
                                                setFieldValue("country", e.target.value)
                                            }}
                                            type="text"
                                            className="w-full border border-grey-300 rounded-md p-2"
                                        >
                                            <option value={''} selected disabled>
                                                Country where your service is located
                                            </option>
                                            {
                                                countries.map((c, i) => {
                                                    const { title, value } = c

                                                    return (
                                                        <option key={i} value={value}>
                                                            {title}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <ErrorMessage name="country">
                                            {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                        </ErrorMessage>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-grey-600 mb-1">State</label>
                                        <select
                                            name="state"
                                            value={values.state}
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                setFieldValue("city", "")
                                                setFieldValue("state", e.target.value)
                                            }}
                                            type="text"
                                            className="w-full border border-grey-300 rounded-md p-2"
                                        >
                                            <option value={''} selected disabled>
                                                State where your service is located
                                            </option>
                                            {
                                                states.filter(s => s?.country === values?.country).map((s, i) => {
                                                    const { title, value } = s

                                                    return (
                                                        <option key={i} value={value}>
                                                            {title}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <ErrorMessage name="state">
                                            {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                        </ErrorMessage>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-grey-600 mb-1">City/LGA</label>
                                        <select
                                            name="city"
                                            value={values.city}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            type="text"
                                            className="w-full border border-grey-300 rounded-md p-2"
                                        >
                                            <option value={''} selected disabled>
                                                City where your service is located
                                            </option>
                                            {
                                                NigerianCities.filter(c => c?.state === values?.state)[0]?.lgas.map((c, i) => {
                                                    return (
                                                        <option key={i} value={c}>
                                                            {c}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <ErrorMessage name="city">
                                            {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                        </ErrorMessage>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-grey-600 mb-1">Location</label>
                                        <input
                                            name="location"
                                            value={values.location}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            placeholder="Specific address"
                                            className="w-full border border-grey-300 rounded-md p-2"
                                        />
                                        <ErrorMessage name="location">
                                            {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                        </ErrorMessage>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-grey-600 mb-1">Service Category</label>
                                        <select
                                            name="service_category"
                                            value={values.service_category}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full border border-grey-300 rounded-md p-2.5 focus:outline-none text-grey-500"
                                        >
                                            <option value={""} selected disabled>Select Category that applies</option>
                                            {
                                                allServices.map((_service, i) => {

                                                    const { service } = _service

                                                    return (
                                                        <option
                                                            key={i}
                                                            value={service?.toLowerCase().replaceAll(" ", "_")}
                                                        >
                                                            {service}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <ErrorMessage name="service_category">
                                            {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                        </ErrorMessage>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-grey-600 mb-1">Service Details</label>
                                        <textarea
                                            name="service_details"
                                            value={values.service_details}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            style={{
                                                minHeight: '200px',
                                                minWidth: '100%'
                                            }}
                                            placeholder=" e.g this service includes a 1hr long massage."
                                            className="w-full border border-gray-300 rounded-md p-2 placeholder:text-start align-top"
                                        />
                                        <ErrorMessage name="service_details">
                                            {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                        </ErrorMessage>
                                    </div>
                                </div>

                                <div className={`flex justify-center gap-3 mt-10`}>
                                    {goBackBtnFunc && (
                                        <button
                                            onClick={goBackBtnFunc}
                                            className={`w-1/3 cursor-pointer px-4 py-2 bg-gray-200 text-gray-600 rounded-4xl`}
                                        >
                                            Go back
                                        </button>
                                    )}
                                    {continueBtnFunc && (
                                        <button
                                            onClick={handleSubmit}
                                            className={`cursor-pointer w-1/3 px-4 py-2 bg-purple-700 text-white rounded-4xl`}
                                        >
                                            Continue
                                        </button>
                                    )}
                                </div>
                            </Modal>
                        )}
                    </Formik>
                </>
            )}
        </div>
    );
}
