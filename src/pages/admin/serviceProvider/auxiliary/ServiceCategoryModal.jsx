import { FaArrowLeft } from "react-icons/fa";
import Modal from "../../components/ui/Modal";
import { useSelector } from "react-redux";
import { getAdminState } from "../../../../redux/slices/adminState";
import { BsTrash } from "react-icons/bs";
import ZeroItems from "../../components/ZeroItems";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ServiceCategoryModal({ modalProps, setApiReqs }) {

    const vendorServiceCategories = useSelector(state => getAdminState(state).vendorServiceCategories)

    const [serviceCategoryInput, setServiceCategoryInput] = useState('')

    if (!modalProps) return <></>

    const { hide, visible } = modalProps

    const handleAddServiceCategory = () => {
        if (!serviceCategoryInput) return;

        const sCategories = vendorServiceCategories?.map(sp => sp?.service?.toLowerCase())

        if (sCategories?.includes(serviceCategoryInput?.toLowerCase())) {
            return toast.info("Service Category already exists")
        }

        setApiReqs({
            isLoading: true,
            errorMsg: null,
            data: {
                type: 'addVendorServiceCategory',
                requestInfo: {
                    service: serviceCategoryInput
                }
            }
        })
    }

    return (
        <Modal
            onClose={hide}
            isOpen={visible}
        >
            <div className="mb-5">
                {/* Header */}
                <div className="flex items-start justify-between p-0 pb-4">
                    <h1 className="text-lg font-bold">
                        Vendor's Service Categories
                    </h1>
                </div>
            </div>

            <div className="mb-5">
                <div className="flex align-items-center gap-2">
                    <input
                        type="text"
                        value={serviceCategoryInput}
                        onChange={e => setServiceCategoryInput(e?.target?.value)}
                        placeholder="New service category..."
                        class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none"
                    />
                    <button
                        onClick={handleAddServiceCategory}
                        className={'bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer'}
                    >
                        Add
                    </button>
                </div>
            </div>

            {
                vendorServiceCategories?.length > 0
                    ?
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Services:</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                vendorServiceCategories?.map((sp, i) => {
                                    const { service } = sp

                                    const handleDeleteServiceCategory = () => {
                                        if (vendorServiceCategories?.length > 1) {
                                            return setApiReqs({
                                                isLoading: true,
                                                errorMsg: null,
                                                data: {
                                                    type: 'deleteVendorServiceCategory',
                                                    requestInfo: {
                                                        service: service
                                                    }
                                                }
                                            })
                                        }

                                        toast.info("At least 1 service category must exist")
                                    }

                                    return (
                                        <tr key={i} className="border-b hover:bg-gray-50 transition">
                                            <td className="py-3 px-4">{service}</td>
                                            <td className="py-3 px-4 text-right space-x-3">
                                                <button
                                                    onClick={handleDeleteServiceCategory}
                                                    className="text-red-600 hover:text-red-700 transition cursor-pointer"
                                                >
                                                    <BsTrash color="red" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    :
                    <div className="flex-1 items-center justify-center p-4 w-full">
                        <ZeroItems zeroText={'No provider specialties added!'} />
                    </div>
            }
        </Modal>
    )
}