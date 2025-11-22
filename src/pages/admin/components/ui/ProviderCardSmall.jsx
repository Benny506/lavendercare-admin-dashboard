import React from "react";
import { FaUserAlt, FaTrash, FaStar } from "react-icons/fa";
import { getPublicImageUrl } from "../../../../lib/requestApi";

const ProviderCardSmall = ({ provider, showDelete = true, onDelete }) => {
    if (!provider) return <></>;

    const {
        provider_name,
        provider_bio,
        provider_specialties,
        profile_img,
        professional_title,
        years_of_experience,
        avg_rating,
    } = provider;

    const imageUrl = profile_img
        ? getPublicImageUrl({ path: profile_img, bucket_name: "user_profiles" })
        : null;

    return (
        <div className="relative w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-500 ease-in-out">


            {/* DELETE BUTTON */}
            {showDelete && (
                <button
                    onClick={() => onDelete?.(provider)}
                    className="absolute top-2 right-2 z-20 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors duration-300"
                >
                    <FaTrash className="text-xs" />
                </button>
            )}

            <div className="relative w-full h-50 flex items-center justify-center bg-gray-100">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={provider_name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
                    />
                ) : (
                    <FaUserAlt className="text-gray-400 text-4xl" />
                )}
            </div>

            <div className="p-2 text-center">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{provider_name}</h3>

                <div className="flex flex-wrap justify-center items-center gap-1 text-xs text-gray-500 mt-1">
                    {professional_title && <span>{professional_title}</span>}
                    {years_of_experience !== undefined && <span>{years_of_experience} yrs</span>}
                    {avg_rating !== undefined && (
                        <span className="flex items-center gap-0.5">
                            <FaStar className="text-yellow-400 text-xs" /> {avg_rating.toFixed(1)}
                        </span>
                    )}
                </div>

                {provider_specialties?.length > 0 && (
                    <div className="mt-1 flex flex-wrap justify-center gap-1">
                        {provider_specialties.map((spec, idx) => (
                            <span
                                key={idx}
                                className="text-[10px] bg-green-100 text-green-800 px-1 py-0.5 rounded-full transition-colors duration-300 hover:bg-green-200"
                            >
                                {spec}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>

    );
};

export default ProviderCardSmall;
