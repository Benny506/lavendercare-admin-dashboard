import { FaLine } from "react-icons/fa"
import Modal from "../../components/ui/Modal"
import { GoDash } from "react-icons/go";

export default function ServiceInfoModal({ modalProps }){
    if(!modalProps) return <></>

    const { visible, hide, service } = modalProps

    if(!service) return <></>

    console.log(service)

    return(
        <Modal
            isOpen={visible}
            onClose={hide}
        >
            <div>
                <div className="pb-4 border-b mb-6">
                    <h1 className="text-2xl">
                        { service?.service_name }
                    </h1>
                    <p className="text-gray-500">
                        { service?.vendorProfile?.business_name }
                    </p>
                </div>  
                
                <div className="flex flex-col gap-1 pb-4 border-b mb-6">
                    <h1 className="text-xl mb-2">
                        Service details
                    </h1>
                    <p className="text-gray-500">
                        { service?.service_details }
                    </p>
                    <p className="text-gray-500">
                        { service?.service_category?.replaceAll("_", " ") }
                    </p> 
                    <p className="text-gray-500">
                        { service?.location }
                    </p>                                        
                </div> 
                
                <div className="flex flex-col gap-1 pb-4 border-b mb-6">
                    <h1 className="text-xl mb-2">
                        Pricing
                    </h1>
                    <p className="text-gray-500">
                        { service?.pricing_type }
                    </p>
                    <p className="text-gray-500">
                        { service?.currency } { service?.amount}
                    </p>                    
                </div>  

                <div className="flex flex-col gap-1 pb-4 border-b mb-6">
                    <h1 className="text-xl mb-2">
                        Availability
                    </h1>
                    {
                        service?.availability
                        ?
                            Object.keys(service?.availability).map((day, i) => {
                                const slotsArr = (service?.availability[day] || []).filter(slot => slot?.end_hour && slot?.start_hour)
                                
                                if(slotsArr?.length === 0) return <></>

                                return(
                                    <div
                                        key={i}
                                        className="mb-4"
                                    >
                                        <p className="capitalize font-bold text-sm text-gray-500 mb-3">
                                            { day }
                                        </p>

                                        {
                                            slotsArr?.length > 0
                                            ?
                                                slotsArr?.map((slot, slotIndex) => {
                                                    const { end_hour, start_hour } = slot

                                                    return(
                                                        <div
                                                            key={slotIndex}
                                                            className="flex items-center gap-3"
                                                        >
                                                            <p>
                                                                { start_hour }
                                                            </p>
                                                            <GoDash />
                                                            <p>
                                                                { end_hour }
                                                            </p>
                                                        </div>
                                                    )
                                                })
                                            :
                                                <p className="text-gray-500">
                                                    Not set
                                                </p>
                                        }
                                    </div>
                                )
                            })
                        :
                            <p className="text-gray-500">
                                Not set
                            </p>
                    }                  
                </div>                                                                
            </div>
        </Modal>
    )
}