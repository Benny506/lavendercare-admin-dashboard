import React from "react";
import { FaTrash, FaUserAlt } from "react-icons/fa";
import { getPublicImageUrl } from "../../../../lib/requestApi";

const ServiceCardSmall = ({ service, showDelete = true, onDelete }) => {
    if (!service) return <></>;


    const { service_name, service_category } = service;
    const business_name = service?.vendor_profile?.business_name;

    const profile_img = service?.vendor_profile?.profile_img
        ? getPublicImageUrl({ path: service.vendor_profile.profile_img, bucket_name: 'user_profiles' })
        : null;

    return (
        <div className="relative w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-500 ease-in-out p-2 text-center">

            {/* DELETE BUTTON */}
            {showDelete && (
                <button
                    onClick={() => onDelete?.(service)}
                    className="absolute top-2 right-2 z-20 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors duration-300"
                >
                    <FaTrash className="text-xs" />
                </button>
            )}

            <h3 className="text-sm font-semibold text-gray-800 truncate">{service_name}</h3>

            <div className="flex flex-wrap justify-center items-center gap-1 text-xs text-gray-500 mt-1">
                {profile_img ? (
                    <img
                        src={profile_img}
                        alt={business_name}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <FaUserAlt className="text-gray-400 w-10 h-10" />
                )}
                {business_name && <span className="font-medium text-md">{business_name}</span>}
                {service_category && <span className="italic text-md">{service_category}</span>}
            </div>
        </div>
    );


};

export default ServiceCardSmall;
