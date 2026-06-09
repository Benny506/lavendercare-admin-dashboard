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
import { BsDot } from "react-icons/bs";
import ServiceCard from "./ServiceCard";

export default function VendorServices({ provider }) {
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
                    requestInfo: { vendor_id: provider?.id }
                }
            })
        }
    }, [])

    useEffect(() => {
        const { isLoading, data } = apiReqs

        if (isLoading) dispatch(appLoadStart());
        else dispatch(appLoadStop());

        if (isLoading && data) {
            const { type, requestInfo } = data

            if (type === 'fetchServices') {
                fetchServices({ requestInfo })
            }
        }
    }, [apiReqs])

    const fetchServices = async ({ requestInfo }) => {
        try {

            const { vendor_id } = requestInfo

            await fetchVendorServices({
                callBack: ({ services }) => {
                    setServices(services)
                },
                vendor_id
            })


        } catch (error) {
            console.log(error)
            toast.error("Something went wrong! Try again")

        } finally {
            setApiReqs({ isLoading: false, errorMsg: null, data: null })
        }
    }

    if (!provider) return <></>

    const filteredServices = (services || []).filter(s => {
        return true
    })

    return (
        <div>
            {/* Service Cards */}
            {filteredServices && filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredServices.map((service, i) => {

                        const { service_name, service_category,
                            status, country, state, city, location
                        } = service

                        return (
                            <ServiceCard
                                key={i}
                                service={service}
                                provider={provider}
                            />
                        )
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    {/* <Icon icon="material-symbols:work-outline" className="w-16 h-16 mb-4 text-primary-700" /> */}
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No services to display
                    </h3>
                    <p className="text-sm text-gray-500 text-center">
                        Vendor has not added any services
                    </p>
                </div>
            )}

        </div>
    )
}