import { useEffect, useState } from "react"
import useApiReqs from "../../../hooks/useApiReqs"
import Modal from "./ui/Modal"
import ZeroItems from "./ZeroItems"
import ProductCard from "./ui/ProductCard"
import ProviderCard from "./ui/ProviderCard"
import ServiceCard from "./ui/ServiceCard"

export default function ServicesModal({ modalProps, onServiceSelected = () => { }, selectedServicesIds=[] }) {

    const { fetchServices } = useApiReqs()

    const [allServices, setAllServices] = useState([])

    useEffect(() => {
        if (modalProps?.visible) {
            fetchServices({
                callBack: ({ services }) => {
                    setAllServices(services || [])
                }
            })
        }
    }, [modalProps])

    const handleSelectService = (service) => {
        onServiceSelected(service)
        
        modalProps?.hide && modalProps?.hide()
    }

    if (!modalProps) return <></>

    const { visible, hide } = modalProps

    const filteredServices = allServices?.map(s => {
        if(selectedServicesIds?.includes(s?.id)){
            return {
                ...s,
                isSelected: true
            }
        }

        return s
    })?.filter(s => s?.status === 'approved')

    return (
        <Modal
            isOpen={visible}
            onClose={hide}
        >
            <div className="flex items-center justify-between border-b border-gray-200 mb-5 py-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    All APPROVED Services
                </h2>
            </div>

            {
                filteredServices?.length > 0
                    ?
                    <div className="flex items-stretch justify-between gap-0 flex-wrap">
                        {
                            filteredServices?.map((s, i) => {
                                return (
                                    <div
                                        key={i}
                                        className="lg:w-1/3 w-full px-0 mb-7"
                                    >
                                        <ServiceCard
                                            service={s}
                                            handleSelectService={handleSelectService}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                    :
                    <div className="flex items-center justify-center flex-1">
                        <ZeroItems zeroText={"No services found"} />
                    </div>
            }
        </Modal>
    )
}