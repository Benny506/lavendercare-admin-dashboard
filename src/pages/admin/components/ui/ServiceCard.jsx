import React from "react";
import { getPublicImageUrl } from "../../../../lib/requestApi";
import { FaUserAlt } from "react-icons/fa";

const ServiceCard = ({ service, handleSelectService = () => {} }) => {
if (!service) return <></>;


const {
    service_name,
    service_category,
    service_details,
    isSelected,
} = service;

const business_name = service?.vendor_profile?.business_name;

const profile_img = service?.vendor_profile?.profile_img
    ? getPublicImageUrl({ path: service.vendor_profile.profile_img, bucket_name: 'user_profiles' })
    : null;

return (
    <div className="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-500 ease-in-out">
        <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800">{service_name}</h2>

            <div className="flex items-center text-sm text-gray-500 mt-2 gap-2 flex-wrap">
                {profile_img ? (
                    <img
                        src={profile_img}
                        alt={business_name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <FaUserAlt className="text-gray-400 w-12 h-12" />
                )}
                {business_name && <span className="font-medium">{business_name}</span>}
                {service_category && <span className="italic">{service_category}</span>}
            </div>

            <p className="mt-2 text-gray-600 text-sm line-clamp-3">{service_details}</p>

            {isSelected ? (
                <p className="text-gray-700 mt-4 text-center text-sm">Already selected</p>
            ) : (
                <button
                    onClick={() => handleSelectService(service)}
                    className="cursor-pointer mt-4 w-full bg-purple-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-purple-700 hover:shadow-lg transition-all duration-300"
                >
                    Select
                </button>
            )}
        </div>
    </div>
);


};

export default ServiceCard;
