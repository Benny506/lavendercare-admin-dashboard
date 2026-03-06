import React, { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaPlus } from 'react-icons/fa';
import ProductsModal from '../../../components/ProductsModal';
import ServicesModal from '../../../components/ServicesModal';
import ProductCardSmall from '../../../components/ui/ProductCardSmall';
import ServiceCardSmall from '../../../components/ui/ServiceCardSmall';

export default function AdCustomization({ data, onChange, onBack, onNext, isEditMode = false }) {
    const fileInputRef = useRef(null);
    const [productsModal, setProductsModal] = useState(false);
    const [servicesModal, setServicesModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    const formatDatetimeLocal = (value) => {
        if (!value) return '';
        if (typeof value === 'string' && value.length === 16 && value[10] === 'T') return value;
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return '';
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const isVideo = file.type.startsWith('video/');
        const maxSize = isVideo ? 20 * 1024 * 1024 : 5 * 1024 * 1024;

        if (file.size > maxSize) {
            alert(`File too large. Max ${isVideo ? '20MB' : '5MB'} allowed.`);
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        
        onChange({
            ...data,
            media_file: file,
            media_type: isVideo ? 'video' : 'image',
            media_preview: previewUrl
        });
    };

    const handleDestinationChange = (e) => {
        const newType = e.target.value;
        onChange({
            ...data,
            destination_type: newType,
            product_id: null,
            service_id: null,
            external_link: ''
        });
        setSelectedProduct(null);
        setSelectedService(null);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-6">Customize Your Ad</h3>
            
            <div className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={e => onChange({...data, title: e.target.value})}
                        placeholder="e.g. Summer Sale - 50% Off!"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F3DCB]/20 outline-none transition"
                        maxLength={50}
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{data.title.length}/50</div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        value={data.description}
                        onChange={e => onChange({...data, description: e.target.value})}
                        placeholder="Describe your offer..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F3DCB]/20 outline-none transition resize-none"
                        maxLength={150}
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{data.description.length}/150</div>
                </div>

                {/* Destination Type Logic */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination Type</label>
                    <select
                        value={data.destination_type}
                        onChange={handleDestinationChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F3DCB]/20 outline-none transition"
                    >
                        <option value="informative">Informative (No Link)</option>
                        <option value="external">External Link</option>
                        <option value="product">Product</option>
                        <option value="service">Service</option>
                    </select>
                </div>

                {/* Conditional Fields based on Destination Type */}
                {data.destination_type === 'external' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">External URL <span className="text-red-500">*</span></label>
                        <input
                            type="url"
                            value={data.external_link}
                            onChange={e => onChange({...data, external_link: e.target.value})}
                            placeholder="https://..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F3DCB]/20 outline-none transition"
                        />
                    </div>
                )}

                 {/* Product Selector */}
                 {data.destination_type === 'product' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Product <span className="text-red-500">*</span></label>
                        {!selectedProduct ? (
                            <button
                                type="button"
                                onClick={() => setProductsModal(true)}
                                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#6F3DCB] hover:text-[#6F3DCB] transition-colors flex items-center justify-center gap-2"
                            >
                                <FaPlus /> Select Product
                            </button>
                        ) : (
                            <ProductCardSmall
                                product={selectedProduct}
                                onDelete={() => {
                                    setSelectedProduct(null);
                                    onChange({...data, product_id: null});
                                }}
                            />
                        )}
                    </div>
                )}

                 {/* Service Selector */}
                 {data.destination_type === 'service' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Service <span className="text-red-500">*</span></label>
                        {!selectedService ? (
                            <button
                                type="button"
                                onClick={() => setServicesModal(true)}
                                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#6F3DCB] hover:text-[#6F3DCB] transition-colors flex items-center justify-center gap-2"
                            >
                                <FaPlus /> Select Service
                            </button>
                        ) : (
                            <ServiceCardSmall
                                service={selectedService}
                                onDelete={() => {
                                    setSelectedService(null);
                                    onChange({...data, service_id: null});
                                }}
                            />
                        )}
                    </div>
                )}

                {/* CTA Text (Only if not informative) */}
                {data.destination_type !== 'informative' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Call to Action</label>
                        <div className="relative">
                            <input
                                list="cta-suggestions"
                                type="text"
                                value={data.cta_text}
                                onChange={e => onChange({...data, cta_text: e.target.value})}
                                placeholder="Enter CTA text..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F3DCB]/20 outline-none transition"
                            />
                            <datalist id="cta-suggestions">
                                <option value="Learn More" />
                                <option value="Shop Now" />
                                <option value="Sign Up" />
                                <option value="Contact Us" />
                                <option value="Book Now" />
                                <option value="Get Started" />
                                <option value="View Offer" />
                            </datalist>
                        </div>
                    </div>
                )}

                {/* Media Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ad Media</label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition group"
                    >
                        {data.media_preview || data.image_url ? (
                            <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden">
                                {data.media_type === 'video' ? (
                                    <video src={data.media_preview || data.image_url} className="w-full h-full object-contain" controls />
                                ) : (
                                    <img src={data.media_preview || data.image_url} alt="Preview" className="w-full h-full object-contain" />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-medium">
                                    Click to Replace
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-purple-50 text-[#6F3DCB] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
                                    <FaCloudUploadAlt size={24} />
                                </div>
                                <p className="text-gray-600 font-medium">Click to upload image or video</p>
                                <p className="text-gray-400 text-sm mt-1">Images max 5MB, Videos max 20MB</p>
                            </>
                        )}
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            className="hidden" 
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {/* Color Tone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Color</label>
                    <div className="flex gap-3 flex-wrap">
                        {['#6F3DCB', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#000000'].map(color => (
                            <button
                                key={color}
                                onClick={() => onChange({...data, color_tone: color})}
                                className={`w-8 h-8 rounded-full border-2 transition ${
                                    data.color_tone === color ? 'border-gray-800 scale-110 ring-2 ring-offset-2 ring-gray-200' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date <span className="text-red-500">*</span></label>
                    <input
                        type="datetime-local"
                        value={formatDatetimeLocal(data.expires_at)}
                        onChange={(e) => onChange({ ...data, expires_at: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6F3DCB]/20 outline-none transition"
                    />
                </div>
            </div>

            {!isEditMode && (
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                    <button
                        onClick={onBack}
                        className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition"
                    >
                        Back
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!data.title || (!data.media_file && !data.image_url) || !data.expires_at}
                        className="bg-[#6F3DCB] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#5b32a8] transition shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next: Review
                    </button>
                </div>
            )}

            {/* Modals */}
            <ProductsModal
                modalProps={{
                    visible: productsModal,
                    hide: () => setProductsModal(false)
                }}
                onProductSelected={(product) => {
                    setSelectedProduct(product);
                    onChange({...data, product_id: product.id});
                    setProductsModal(false);
                }}
                selectedProductIds={selectedProduct ? [selectedProduct.id] : []}
            />

            <ServicesModal
                modalProps={{
                    visible: servicesModal,
                    hide: () => setServicesModal(false)
                }}
                onServiceSelected={(service) => {
                    setSelectedService(service);
                    onChange({...data, service_id: service.id});
                    setServicesModal(false);
                }}
                selectedServicesIds={selectedService ? [selectedService.id] : []}
            />
        </div>
    );
}
