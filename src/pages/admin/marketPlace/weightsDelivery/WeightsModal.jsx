import { ErrorMessage, Formik } from "formik"
import * as yup from 'yup'
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid'
import { toast } from "react-toastify";
import ErrorMsg1 from "../../components/ErrorMsg1";
import ZeroItems from "../../components/ZeroItems";
import { uniqueArrByKey } from "../../../../lib/utils";
import useApiReqs from "../../../../hooks/useApiReqs";
import Modal from "../../components/ui/Modal";
import AddDestinationModal from "./AddDestinationModal";
import Button from "../../components/ui/Button";

export const weightsDeliveryLocationsMap = [
    'lagos mainland', 'lagos island', 'outside lagos', 'african countries', 'other countries'
]

export default function WeightsModal({ modalProps }) {

    const { fetchWeightsDeliveryOptions, addWeightsDeliveryOption, deleteWeightsDeliveryOption } = useApiReqs()
    const [options, setOptions] = useState([])
    const [addDestinationModal, setAddDestinationModal] = useState({ visible: false, hide: null })
    const [destinations, setDestinations] = useState([])

    useEffect(() => {
        if (modalProps?.visible) {
            fetchWeightsDeliveryOptions({
                callBack: ({ options, destinations }) => {
                    setOptions(options)
                    setDestinations(destinations)
                }
            })
        }
    }, [modalProps])

    const openAddDestinationModal = () => setAddDestinationModal({ visible: true, hide: hideAddDestinationModal })
    const hideAddDestinationModal = () => setAddDestinationModal({ visible: false, hide: null })

    if (!modalProps) return <></>;
    const { visible, hide } = modalProps

    if (addDestinationModal?.visible) return (
        <AddDestinationModal
            modalProps={addDestinationModal}
            _setDestinations={setDestinations}
        />
    )

    return (
        <>
            <Modal
                isOpen={visible}
                onClose={hide}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center py-4 mb-5">
                    <h2 className="font-bold text-xl font-poppins">
                        Weights + Delivery
                    </h2>
                </div>

                {/* BODY */}
                <div className="max-h-[80vh] overflow-y-auto">
                    <Formik
                        validationSchema={
                            yup.object().shape({
                                flat_fee: yup.number().required("Required"),
                                threshold: yup.number().nullable(),
                                extra_cost_per_threshold: yup.number().nullable(),
                                price_currency: yup.string().required(),
                                destination: yup.string().required("Destination is required"),
                            })
                                .test("threshold-missing", "Threshold is required when extra cost is provided", (v) => {
                                    if (v.extra_cost_per_threshold && !v.threshold) return false;
                                    if (v.extra_cost_per_threshold && v.threshold <= 0) return false
                                    return true;
                                })
                                .test("extra-missing", "Extra cost per threshold is required when threshold is provided", (v) => {
                                    if (v.threshold && !v.extra_cost_per_threshold) return false;
                                    if (v.threshold && v.extra_cost_per_threshold <= 0) return false
                                    return true;
                                })
                        }
                        initialValues={{
                            flat_fee: "",
                            threshold: "",
                            extra_cost_per_threshold: "",
                            price_currency: "NGN",
                            destination: ''
                        }}
                        onSubmit={async (values, { resetForm }) => {
                            const existingOption = options?.find(
                                opt => opt?.destination?.toLowerCase() === values?.destination?.toLowerCase()
                            )

                            const thresh = isNaN(Number(values?.threshold)) ? null : Number(values?.threshold)
                            const extra = isNaN(Number(values.extra_cost_per_threshold)) ? null : Number(values?.extra_cost_per_threshold)

                            if (thresh && (!extra || extra <= 0)) return toast.info("Extra cost per threshold is required when threshold is provided")
                            if (extra && (!thresh || thresh <= 0)) return toast.info("Threshold is required when extra cost is provided")

                            addWeightsDeliveryOption({
                                callBack: ({ newWeightDeliveryOption }) => {
                                    if (!newWeightDeliveryOption) return;
                                    const updated = [...options, newWeightDeliveryOption]
                                    setOptions(uniqueArrByKey(updated, 'destination'))
                                    resetForm();
                                },
                                columns: {
                                    flat_fee: values.flat_fee,
                                    threshold: thresh,
                                    extra_cost_per_threshold: extra,
                                    destination: values.destination,
                                    id: existingOption?.id || uuidv4(),
                                    created_at: existingOption?.created_at || new Date().toISOString(),
                                }
                            })
                        }}
                    >
                        {({
                            values,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            setFieldValue,
                        }) => (

                            <div className="flex items-start flex-wrap gap-4">

                                {/* DESTINATION */}
                                <div className="w-full">
                                    <div className="w-full gap-2">
                                        <label className="block font-medium mb-1">Destination</label>
                                        <select
                                            name="destination"
                                            value={values.destination}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-purple-500"
                                        >
                                            <option value="">Delivered to?</option>
                                            {destinations?.map((opt, i) => {

                                                const destination = opt?.destination

                                                return (
                                                    <option key={i} value={destination}>{destination}</option>
                                                )
                                            })}
                                        </select>
                                        <div className="mt-2">
                                            <Button
                                                onClick={openAddDestinationModal}
                                            >
                                                Update
                                            </Button>
                                        </div>
                                    </div>
                                    <ErrorMessage name="destination" render={(msg) => <ErrorMsg1 errorMsg={msg} />} />
                                </div>

                                {/* FLAT FEE */}
                                <div className="lg:w-2/5 md:w-full">
                                    <label className="block font-medium mb-1">Flat fee</label>
                                    <div className="flex">
                                        <select
                                            value={values.price_currency}
                                            disabled
                                            className="border border-r-0 rounded-l px-2 bg-gray-100 text-gray-600"
                                        >
                                            <option value="NGN">NGN</option>
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            name="flat_fee"
                                            value={values.flat_fee}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full border rounded-r px-3 py-2 focus:ring focus:ring-purple-500"
                                        />
                                    </div>
                                    <ErrorMessage name="flat_fee" render={(msg) => <ErrorMsg1 errorMsg={msg} />} />
                                </div>

                                {/* THRESHOLD */}
                                <div className="lg:w-2/5 md:2-full">
                                    <label className="block font-medium mb-1">Threshold (kg)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        name="threshold"
                                        value={values.threshold}
                                        onChange={e => {
                                            handleChange(e)
                                            setFieldValue("extra_cost_per_threshold", "")
                                        }}
                                        onBlur={handleBlur}
                                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-purple-500"
                                    />
                                    <ErrorMessage name="threshold" render={(msg) => <ErrorMsg1 errorMsg={msg} />} />
                                </div>

                                {/* EXTRA COST */}
                                {values.threshold &&
                                    <div className="lg:w-2/5 md:2-full">
                                        <label className="block font-medium mb-1">
                                            Extra-cost per {values.threshold}kg
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            name="extra_cost_per_threshold"
                                            value={values.extra_cost_per_threshold}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-purple-500"
                                        />
                                        <ErrorMessage name="extra_cost_per_threshold" render={(msg) => <ErrorMsg1 errorMsg={msg} />} />
                                    </div>
                                }

                                <div className="w-full">
                                    <button
                                        className="border border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white px-4 py-2 rounded transition mb-7"
                                        onClick={handleSubmit}
                                    >
                                        Add Option
                                    </button>

                                    {/* LIST */}
                                    {options.length > 0 ? (
                                        <div>
                                            <h6 className="font-semibold mb-2 text-lg">
                                                Delivery-Weights Options
                                            </h6>

                                            <table className="w-full border rounded overflow-hidden text-sm">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="border px-3 py-2 text-left">Flat Fee</th>
                                                        <th className="border px-3 py-2 text-left">Threshold</th>
                                                        <th className="border px-3 py-2 text-left">Extra Cost</th>
                                                        <th className="border px-3 py-2 text-left">Destination</th>
                                                        <th className="border px-3 py-2 text-left">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {options.map((opt, i) => {

                                                        const { flat_fee, threshold, extra_cost_per_threshold, destination } = opt

                                                        const onDelete = () => {
                                                            deleteWeightsDeliveryOption({
                                                                callBack: ({ deleted_option_id }) => {
                                                                    setOptions(options.filter(o => o.id !== deleted_option_id))
                                                                },
                                                                option_id: opt?.id
                                                            })
                                                        }

                                                        return (
                                                            <tr key={i}>
                                                                <td className="border px-3 py-2">{flat_fee}</td>
                                                                <td className="border px-3 py-2">{threshold ?? "Not set"}</td>
                                                                <td className="border px-3 py-2">{extra_cost_per_threshold ?? "Not set"}</td>
                                                                <td className="border px-3 py-2">{destination}</td>
                                                                <td className="border px-3 py-2">
                                                                    <MdDelete
                                                                        onClick={onDelete}
                                                                        size={20}
                                                                        className="text-red-600 cursor-pointer hover:text-red-800"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <ZeroItems zeroText="No delivery-weight options set yet!" />
                                    )}
                                </div>
                            </div>
                        )}
                    </Formik>
                </div>
            </Modal>
        </>
    )
}
