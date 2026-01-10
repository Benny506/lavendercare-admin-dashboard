import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import useApiReqs from "../../../../hooks/useApiReqs";
import ZeroItems from "../../components/ZeroItems";
import ErrorMsg1 from "../../components/ErrorMsg1";

export default function AddDestinationModal({ modalProps, _setDestinations }) {
    
    const { fetchWeightsDeliveryOptions, addDeliveryDestination, deleteDeliveryDestination } = useApiReqs();

    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        if (modalProps?.visible) {
            fetchWeightsDeliveryOptions({
                callBack: ({ options, destinations }) => {
                    setDestinations(destinations);
                },
            });
        }
    }, [modalProps]);

    useEffect(() => {
        if (_setDestinations && destinations) {
            _setDestinations(destinations);
        }
    }, [destinations]);

    if (!modalProps) return <></>;

    const { visible, hide } = modalProps;

    return (
        <Modal isOpen={visible} onClose={hide} className="relative z-50">
            <div className="">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <h1 className="font-bold text-lg font-poppins">
                            Delivery Destinations
                        </h1>
                    </div>

                    <div className="p-4">
                        <Formik
                            validationSchema={yup.object().shape({
                                destination: yup.string().required("Destination is required"),
                            })}
                            initialValues={{ destination: "" }}
                            onSubmit={async (values, { resetForm }) => {
                                addDeliveryDestination({
                                    callBack: ({ newDestination }) => {
                                        if (!newDestination) return;
                                        setDestinations([newDestination, ...(destinations || [])]);
                                        resetForm();
                                    },
                                    columns: { destination: values.destination },
                                });
                            }}
                        >
                            {({ values, handleBlur, handleChange, handleSubmit }) => (
                                <div>
                                    <div className="mb-3">
                                        <label className="block mb-1 font-medium">Destination</label>

                                        <input
                                            name="destination"
                                            placeholder="Type in a destination"
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-purple-300"
                                            value={values.destination}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />

                                        <ErrorMessage name="destination" render={(msg) => <ErrorMsg1 errorMsg={msg} />} />
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        className="px-4 py-1 mb-4 rounded-full border border-purple-600 text-purple-700 font-medium py-2 hover:bg-purple-600 hover:text-white transition"
                                    >
                                        Add Destination
                                    </button>

                                    {destinations.length > 0 ? (
                                        <>
                                            <h6 className="mb-2 font-semibold text-[18px]">Delivery destinations</h6>

                                            <div className="overflow-x-auto">
                                                <table className="w-full border rounded-lg">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            <th className="px-3 py-2 text-left border">Destination</th>
                                                            <th className="px-3 py-2 text-left border">Actions</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {destinations.map((opt, i) => {
                                                            const { destination } = opt;

                                                            const handleRemove = () => {
                                                                deleteDeliveryDestination({
                                                                    callBack: () => {
                                                                        setDestinations(destinations.filter((d) => d.id !== opt.id));
                                                                    },
                                                                    destination_id: opt.id,
                                                                });
                                                            };

                                                            return (
                                                                <tr key={i} className="hover:bg-gray-50">
                                                                    <td className="px-3 py-2 border">{destination}</td>
                                                                    <td className="px-3 py-2 border">
                                                                        <MdDelete
                                                                            onClick={handleRemove}
                                                                            className="cursor-pointer text-red-600"
                                                                            size={20}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    ) : (
                                        <ZeroItems zeroText="No delivery destinations set yet!" />
                                    )}
                                </div>
                            )}
                        </Formik>
                    </div>
            </div>
        </Modal>
    );
}
