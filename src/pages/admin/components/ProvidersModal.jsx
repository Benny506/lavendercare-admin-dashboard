import { useEffect, useState } from "react"
import useApiReqs from "../../../hooks/useApiReqs"
import Modal from "./ui/Modal"
import ZeroItems from "./ZeroItems"
import ProductCard from "./ui/ProductCard"
import ProviderCard from "./ui/ProviderCard"
import { useSelector } from "react-redux"
import { getAdminDetails } from "../../../database/dbInit"

export default function ProvidersModal({ modalProps, onProviderSelected = () => { }, selectedProvidersIds=[] }) {

    const { fetchProviders } = useApiReqs()

    const [allProviders, setAllProviders] = useState([])

    useEffect(() => {
        if (modalProps?.visible) {
            fetchProviders({
                callBack: ({ providers }) => {
                    setAllProviders(providers || [])
                }
            })
        }
    }, [modalProps])

    const handleSelectProvider = (provider) => {
        onProviderSelected(provider)
        
        modalProps?.hide && modalProps?.hide()
    }

    if (!modalProps) return <></>

    const { visible, hide } = modalProps

    const filteredProviders = allProviders?.map(p => {
        if(selectedProvidersIds?.includes(p?.provider_id)){
            return {
                ...p,
                isSelected: true
            }
        }

        return p
    })?.filter(p => p?.license?.status === 'approved')

    return (
        <Modal
            isOpen={visible}
            onClose={hide}
        >
            <div className="flex items-center justify-between border-b border-gray-200 mb-5 py-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    All APPROVED Providers
                </h2>
            </div>

            {
                filteredProviders?.length > 0
                    ?
                    <div className="flex items-stretch justify-between gap-0 flex-wrap">
                        {
                            filteredProviders?.map((p, i) => {
                                return (
                                    <div
                                        key={i}
                                        className="lg:w-1/3 md:w-1/2 w-full px-0 mb-7"
                                    >
                                        <ProviderCard
                                            provider={p}
                                            handleSelectProvider={handleSelectProvider}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                    :
                    <div className="flex items-center justify-center flex-1">
                        <ZeroItems zeroText={"No providers found"} />
                    </div>
            }
        </Modal>
    )
}