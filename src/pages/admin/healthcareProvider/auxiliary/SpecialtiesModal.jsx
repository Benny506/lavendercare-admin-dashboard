import { FaArrowLeft } from "react-icons/fa";
import Modal from "../../components/ui/Modal";
import { useSelector } from "react-redux";
import { getAdminState } from "../../../../redux/slices/adminState";
import { BsTrash } from "react-icons/bs";
import ZeroItems from "../../components/ZeroItems";
import { useState } from "react";
import { toast } from "react-toastify";

export default function SpecialtiesModal({ modalProps, setApiReqs }) {

    const providerSpecialties = useSelector(state => getAdminState(state).providerSpecialties)

    const [specialtyInput, setSpecialtyInput] = useState('')

    if (!modalProps) return <></>

    const { hide, visible } = modalProps

    const handleAddSpecialty = () => {
        if (!specialtyInput) return;

        const specialties = providerSpecialties?.map(sp => sp?.specialty?.toLowerCase())

        if (specialties?.includes(specialtyInput?.toLowerCase())) {
            return toast.info("Specialty already exists")
        }

        setApiReqs({
            isLoading: true,
            errorMsg: null,
            data: {
                type: 'addSpecialty',
                requestInfo: {
                    specialty: specialtyInput
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
                        All Provider Specialties
                    </h1>
                </div>
            </div>

            <div className="mb-5">
                <div className="flex align-items-center gap-2">
                    <input
                        type="text"
                        value={specialtyInput}
                        onChange={e => setSpecialtyInput(e?.target?.value)}
                        placeholder="New specialty..."
                        class="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none"
                    />
                    <button
                        onClick={handleAddSpecialty}
                        className={'bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer'}
                    >
                        Add
                    </button>
                </div>
            </div>

            {
                providerSpecialties?.length > 0
                    ?
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Specialty:</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                providerSpecialties?.map((sp, i) => {
                                    const { specialty } = sp

                                    const handleDeleteSpecialty = () => {
                                        if (providerSpecialties?.length > 1) {
                                            return setApiReqs({
                                                isLoading: true,
                                                errorMsg: null,
                                                data: {
                                                    type: 'deleteSpecialty',
                                                    requestInfo: {
                                                        specialty
                                                    }
                                                }
                                            })
                                        }

                                        toast.info("At least 1 specialty must exist")
                                    }

                                    return (
                                        <tr key={i} className="border-b hover:bg-gray-50 transition">
                                            <td className="py-3 px-4">{specialty}</td>
                                            <td className="py-3 px-4 text-right space-x-3">
                                                <button
                                                    onClick={handleDeleteSpecialty}
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