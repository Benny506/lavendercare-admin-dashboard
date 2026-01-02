import { BsShield } from "react-icons/bs";
import { FaHome } from "react-icons/fa";

export function HealthcareServiceBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
            bg-primary-100 text-primary-700 border border-primary-200">
            <BsShield size={14} />
            Licensed Healthcare
        </span>
    );
}

export function DomesticServiceBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
            bg-gray-100 text-gray-700 border border-gray-200">
            <FaHome size={14} />
            Domestic Service
        </span>
    );
}


export default function ServiceBadge({ service_type }) {
    return (
        service_type === 'healthcare' ? <HealthcareServiceBadge /> : <DomesticServiceBadge />
    )
} 