import React from "react";
import { FaTrash, FaUserAlt } from "react-icons/fa";
import { getPublicImageUrl } from "../../../../lib/requestApi";

const MotherCardSmall = ({ mother, showDelete = true, onDelete }) => {
    if (!mother) return <></>;

    const { name, email, profile_img, is_pregnant } = mother;

    const imageUrl = profile_img
        ? getPublicImageUrl({ path: profile_img, bucket_name: 'user_profiles' })
        : null;

    const userType = is_pregnant === true ? "Pregnant" : is_pregnant === false ? "Mother" : "TTC";

    return (
        <div className="relative w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-500 ease-in-out p-2 text-center">

            {/* DELETE BUTTON */}
            {showDelete && (
                <button
                    onClick={() => onDelete?.(mother)}
                    className="absolute top-2 right-2 z-20 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors duration-300"
                >
                    <FaTrash className="text-xs" />
                </button>
            )}

            <div className="flex flex-col items-center justify-center gap-1">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <FaUserAlt className="text-gray-400 w-12 h-12" />
                )}
                
                <h3 className="text-sm font-semibold text-gray-800 truncate w-full">{name || "Unknown User"}</h3>
                <p className="text-xs text-gray-500 truncate w-full">{email}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    userType === 'Pregnant' ? 'bg-pink-100 text-pink-800' :
                    userType === 'Mother' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                }`}>
                    {userType}
                </span>
            </div>
        </div>
    );
};

export default MotherCardSmall;