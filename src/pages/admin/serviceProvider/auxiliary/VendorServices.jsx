import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { appLoadStart, appLoadStop } from "../../../../redux/slices/appLoadingSlice"
import { PiToggleRightFill, PiToggleLeftFill } from "react-icons/pi";
import { getServiceStatusBadge, servicesMap } from "../../../../lib/utils_Jsx";
import { FaAngleRight } from "react-icons/fa6";
import useApiReqs from "../../../../hooks/useApiReqs";
import { toast } from "react-toastify";
import Badge from "../../components/ui/Badge";
import { formatNumberWithCommas } from "../../../../lib/utils";

export default function VendorServices({ vendor }){
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { fetchVendorServices } = useApiReqs()

    const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
    const [services, setServices] = useState()    

    useEffect(() => {
        if (!services) {
            setApiReqs({
                isLoading: true,
                errorMsg: null,
                data: {
                    type: 'fetchServices',
                    requestInfo: { vendor_id: vendor?.id }
                }
            })
        }
    }, [])

    useEffect(() => {
        const { isLoading, data } = apiReqs

        if(isLoading) dispatch(appLoadStart());
        else dispatch(appLoadStop());

        if(isLoading && data){
            const { type, requestInfo } = data

            if(type === 'fetchServices'){
                fetchServices({ requestInfo })
            }
        }
    }, [apiReqs])

    const fetchServices = async ({ requestInfo }) => {
        try {

            const { vendor_id } = requestInfo

            await fetchVendorServices({
                callBack: ({ vendorServices }) => {
                    setServices(vendorServices)
                },
                vendor_id
            })
            
            
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong! Try again")
        
        } finally{
            setApiReqs({ isLoading: false, errorMsg: null, data: null })
        }
    }

    if(!vendor) return <></>

    const filteredServices = (services || []).filter(s => {
        return true
    })

    return(
        <div>
            {/* Service Cards */}
            {filteredServices && filteredServices.length > 0 ? (
                <div className="flex flex-wrap p-4 justify-between">
                    {filteredServices.map((service, i) => {
                        
                        const { service_name, service_category, pricing_type,
                            amount, status, currency
                            } = service

                        return (
                            <div
                                key={service?.id}
                                className={`lg:w-1/2 w-full lg:mb-2 mb-2 ${i+1%2===0 ? 'pl-2' : 'pr-2'}`}
                            >
                                <div
                                    className="w-full bg-white border rounded-xl p-4 space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">{service_name}</p>

                                        <div className="flex gap-2">
                                            <Badge variant="neutral" className=''>
                                                {service_category?.replaceAll("_", " ")}
                                            </Badge>                                            
                                        </div>
                                    </div>                                   

                                    <p className="text-sm text-grey-700 font-medium">
                                        {pricing_type} Price: {currency} {formatNumberWithCommas(amount)}
                                    </p>

                                    <div className="flex flex-col gap-2">
                                        {getServiceStatusBadge({ status })}                                                                                    
                                        <p className="text-xs">
                                            { servicesMap[status]?.feedBack }
                                        </p>        
                                    </div>

                                    <div className="flex items-center justify-end gap-1">
                                        <div 
                                            onClick={() => navigate('/admin/service-provider/single-vendor/service-details', { state: { service, vendor } })}
                                            className="flex bg-purple-600 items-center gap-2 text-white rounded-lg px-3 py-1 font-extrabold cursor-pointer"
                                        >
                                            <p className="text-sm">View</p>
                                            <FaAngleRight />
                                        </div>
                                    </div>                                    
                                </div>
                            </div>
                        )}
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    {/* <Icon icon="material-symbols:work-outline" className="w-16 h-16 mb-4 text-primary-700" /> */}
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No services to display
                    </h3>
                    <p className="text-sm text-gray-500 text-center">
                        You have not added any services
                    </p>
                </div>
            )}            
        </div>
    )
}