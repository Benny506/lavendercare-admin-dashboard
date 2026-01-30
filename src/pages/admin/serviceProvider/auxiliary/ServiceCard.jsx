import { BsArrowRight, BsDot } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getServiceStatusBadge, servicesMap } from "../../../../lib/utils_Jsx";
import ServiceBadge from "./ServiceBadge";
import Badge from "../../components/ui/Badge";

export default function ServiceCard({ service, provider }) {

    const navigate = useNavigate()

    if (!service || !provider) return <></>

    const {
        id,
        service_name,
        service_category,
        status,
        country,
        state,
        city,
        location,
        types,
        locations,
        is_virtual
    } = service;

    return (
        <div
            className="relative bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
        >
            {/* Gradient Accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#7B3FE4] to-[#9F6AFF]" />

            <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg mb-1 text-gray-900">
                            {service_name}
                        </h3>
                        <Badge variant="primary">
                            {service_category?.replaceAll("_", " ")}
                        </Badge>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        {getServiceStatusBadge({ status })}

                        <ServiceBadge service_type={service?.service_type} />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                        Location
                    </p>
                    <p>
                        {is_virtual ? 'Virtual' : locations?.length > 0 ? locations?.length + ' set' : 'Not set'}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-xs text-gray-500 max-w-[70%]">
                        {servicesMap?.[status]?.feedBack}
                    </p>

                    <button
                        onClick={() => navigate('/admin/services/single-provider/service-details', { state: { service, provider } })}
                        className="flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all"
                    >
                        View
                        <BsArrowRight className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    )
}