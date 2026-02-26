import { useEffect, useState } from "react"
import useApiReqs from "../../../hooks/useApiReqs"
import Modal from "./ui/Modal"
import ZeroItems from "./ZeroItems"
import { FaUserAlt } from "react-icons/fa"
import { getPublicImageUrl } from "../../../lib/requestApi"

export default function MothersModal({ modalProps, onMotherSelected = () => { }, selectedMotherId = null }) {

    const { fetchMothers } = useApiReqs()

    const [allMothers, setAllMothers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        if (modalProps?.visible) {
            fetchMothers({
                callBack: ({ mothers }) => {
                    setAllMothers(mothers || [])
                }
            })
        }
    }, [modalProps])

    const handleSelectMother = (mother) => {
        onMotherSelected(mother)
        modalProps?.hide && modalProps?.hide()
    }

    if (!modalProps) return <></>

    const { visible, hide } = modalProps

    const filteredMothers = allMothers?.filter(m => {
        const search = searchTerm.toLowerCase()
        return (
            m?.name?.toLowerCase().includes(search) ||
            m?.email?.toLowerCase().includes(search) ||
            m?.username?.toLowerCase().includes(search)
        )
    })

    return (
        <Modal
            isOpen={visible}
            onClose={hide}
        >
            <div className="flex flex-col gap-4 border-b border-gray-200 mb-5 py-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    Select a User
                </h2>
                <input
                    type="text"
                    placeholder="Search by name, email or username..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F3DCB]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
                {filteredMothers?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredMothers.map((mother) => {
                            const isSelected = selectedMotherId === mother.id
                            const userType = mother.is_pregnant === true ? "Pregnant" : mother.is_pregnant === false ? "Mother" : "TTC"

                            return (
                                <div
                                    key={mother.id}
                                    onClick={() => handleSelectMother(mother)}
                                    className={`
                                        cursor-pointer p-4 rounded-lg border transition-all duration-200
                                        flex flex-col items-center gap-2 text-center
                                        ${isSelected 
                                            ? "border-[#6F3DCB] bg-[#F5F0FF] shadow-md" 
                                            : "border-gray-200 hover:border-[#6F3DCB] hover:shadow-sm"
                                        }
                                    `}
                                >
                                    {mother.profile_img ? (
                                        <img
                                            src={getPublicImageUrl({ path: mother.profile_img, bucket_name: 'user_profiles' })}
                                            alt={mother.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <FaUserAlt className="text-gray-400 w-16 h-16" />
                                    )}
                                    
                                    <div>
                                        <h3 className="font-semibold text-gray-800 truncate max-w-[150px]">
                                            {mother.name || "Unknown User"}
                                        </h3>
                                        <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                            {mother.email}
                                        </p>
                                        <span className={`
                                            inline-block mt-2 px-2 py-0.5 text-[10px] rounded-full
                                            ${userType === 'Pregnant' ? 'bg-pink-100 text-pink-800' :
                                              userType === 'Mother' ? 'bg-purple-100 text-purple-800' :
                                              'bg-blue-100 text-blue-800'}
                                        `}>
                                            {userType}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-10">
                        <ZeroItems zeroText={"No users found"} />
                    </div>
                )}
            </div>
        </Modal>
    )
}