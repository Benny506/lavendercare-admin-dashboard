import React, { useState, useEffect, useCallback } from 'react';
import useApiReqs from '../../../../hooks/useApiReqs';
import { getPublicImageUrl } from '../../../../lib/requestApi';
import Modal from '../ui/Modal';
import { IoClose, IoSearch, IoCheckmarkCircle } from 'react-icons/io5';

const GlobalServicePicker = ({ isOpen, onClose, onSelect }) => {
    const { searchGlobalApprovedServices } = useApiReqs();
    const [search, setSearch] = useState('');
    const [allServices, setAllServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllServices = useCallback(async () => {
        setLoading(true);
        try {
            const results = await searchGlobalApprovedServices({ searchTerm: '' });
            setAllServices(results || []);
            setFilteredServices(results || []);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [searchGlobalApprovedServices]);

    useEffect(() => {
        if (isOpen && allServices.length === 0) {
            fetchAllServices();
        }
    }, [isOpen, allServices.length, fetchAllServices]);

    useEffect(() => {
        if (!search.trim()) {
            setFilteredServices(allServices);
            return;
        }

        const term = search.toLowerCase();
        const filtered = allServices.filter(service => 
            service.service_name?.toLowerCase().includes(term) || 
            service.service_category?.toLowerCase().includes(term) ||
            service.provider?.username?.toLowerCase().includes(term)
        );
        setFilteredServices(filtered);
    }, [search, allServices]);

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            title="Reference a Service"
            maxWidth="max-w-2xl"
        >
            <div className="flex flex-col h-[70vh]">
                <div className="p-4 border-b">
                    <p className="text-xs text-gray-500 mb-3">
                        Search and select any approved service across all providers to share in the chat.
                    </p>
                    <div className="relative">
                        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by service name or category..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {loading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filteredServices.length === 0 && !loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                            <IoSearch size={48} className="mb-2 opacity-20" />
                            <p className="text-sm">
                                {search ? "No services found matching your search." : "Type to search all services..."}
                            </p>
                        </div>
                    ) : (
                        filteredServices.map((service) => (
                            <div 
                                key={service.id}
                                onClick={() => onSelect(service)}
                                className="group flex flex-col p-4 bg-white border border-gray-100 rounded-2xl hover:border-purple-200 hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-50">
                                    <img 
                                        src={getPublicImageUrl({ path: service.provider?.profile_img, bucket_name: 'user_profiles' })}
                                        className="w-6 h-6 rounded-full object-cover"
                                        alt=""
                                    />
                                    <span className="text-xs font-semibold text-gray-600">
                                        {service.provider?.username || 'Provider'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-gray-800">{service.service_name}</h4>
                                            <IoCheckmarkCircle className="text-green-500" size={16} />
                                        </div>
                                        <div className="inline-block px-2 py-0.5 rounded bg-purple-50 text-[10px] font-bold text-purple-600 uppercase tracking-wide mb-2">
                                            {service.service_category?.replace(/_/g, ' ')}
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-1">
                                            {service.service_details}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                                            {service.service_types?.length || 0} Pricing Tiers
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default GlobalServicePicker;
