import React from 'react';
import { getPublicImageUrl } from '../../../../lib/requestApi';

const ChatServiceCard = ({ service, iAmSender }) => {
    const data = typeof service === 'string' ? JSON.parse(service) : service;

    if (!data) return null;

    return (
        <div className={`w-full max-w-[300px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden`}>
            {/* Provider Info */}
            {data.provider && (
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-50 bg-gray-50/50">
                    <img
                        src={getPublicImageUrl({ path: data.provider.profile_img, bucket_name: 'user_profiles' })}
                        className="w-5 h-5 rounded-full object-cover bg-gray-200"
                        alt={data.provider.username}
                    />
                    <span className="text-[10px] font-medium text-gray-500 truncate">
                        {data.provider.username}
                    </span>
                </div>
            )}

            <div className="p-3">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="text-sm font-bold text-gray-800 line-clamp-2">
                        {data.service_name}
                    </h4>
                </div>

                <div className="inline-block px-2 py-0.5 rounded-md bg-purple-50 text-[10px] font-bold text-purple-600 uppercase tracking-wide mb-2">
                    {data.service_category?.replace(/_/g, ' ')}
                </div>

                <p className="text-[11px] text-gray-600 line-clamp-2 mb-3">
                    {data.service_details}
                </p>

                {/* Pricing */}
                <div className="space-y-1.5">
                    {(data.service_types || []).slice(0, 2).map((type, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] py-1 px-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 font-medium">{type.name}</span>
                            <span className="text-purple-600 font-bold">
                                {type.currency} {type.price}
                            </span>
                        </div>
                    ))}
                    {(data.service_types || []).length > 2 && (
                        <div className="text-[9px] text-center text-gray-400 mt-1">
                            +{(data.service_types || []).length - 2} more pricing tiers
                        </div>
                    )}
                </div>

                {/* <button className="w-full mt-3 py-2 bg-purple-600 text-white text-[11px] font-bold rounded-lg hover:bg-purple-700 transition-colors">
                    View Details
                </button> */}
            </div>
        </div>
    );
};

export default ChatServiceCard;
