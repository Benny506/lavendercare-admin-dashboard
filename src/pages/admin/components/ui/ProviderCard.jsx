import React from "react";
import { FaUserAlt, FaStar } from "react-icons/fa";
import { getPublicImageUrl } from "../../../../lib/requestApi";

const ProviderCard = ({ provider, handleSelectProvider = () => {} }) => {
if (!provider) return <></>;

const {
    username,
    provider_bio,
    provider_specialties,
    isSelected,
    profile_img,
    professional_title,
    years_of_experience,
    rating,
} = provider;

const imageUrl = profile_img
    ? getPublicImageUrl({ path: profile_img, bucket_name: "user_profiles" })
    : null;

return (
    <div className="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-500 ease-in-out">
        <div className="relative w-full h-64 flex items-center justify-center bg-gray-100">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={username}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
                />
            ) : (
                <FaUserAlt className="text-gray-400 text-6xl" />
            )}
        </div>

        <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800">{username}</h2>

            <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1 gap-2">
                {professional_title && <span>{professional_title}</span>}
                {years_of_experience !== undefined && <span>{years_of_experience} yrs exp</span>}
                {rating !== undefined && (
                    <span className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" /> {rating.toFixed(1)}
                    </span>
                )}
            </div>

            <p className="mt-2 text-gray-600 text-sm line-clamp-3">{provider_bio}</p>

            {provider_specialties?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {provider_specialties.map((spec, idx) => (
                        <span
                            key={idx}
                            className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full transition-colors duration-300 hover:bg-purple-200"
                        >
                            {spec}
                        </span>
                    ))}
                </div>
            )}

            {isSelected ? (
                <p className="text-gray-700 mt-4 text-center text-sm">Already selected</p>
            ) : (
                <button
                    onClick={() => handleSelectProvider(provider)}
                    className="cursor-pointer mt-4 w-full bg-purple-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-purple-700 hover:shadow-lg transition-all duration-300"
                >
                    Select
                </button>
            )}
        </div>
    </div>
);

};

export default ProviderCard;
