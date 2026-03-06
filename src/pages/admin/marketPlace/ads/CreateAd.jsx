import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import AdTemplateSelector from './components/AdTemplateSelector';
import AdCustomization from './components/AdCustomization';
import AdPreview from './components/AdPreview';
import { toast } from 'react-toastify';
import supabase from '../../../../database/dbInit';
import useMediaUpload from '../../../../hooks/useMediaUpload';
import PathHeader from '../../components/PathHeader';

export default function CreateAd() {
    const navigate = useNavigate();
    const { uploadMedia, uploadProgress, isUploading } = useMediaUpload();
    
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        template_id: '',
        title: '',
        description: '',
        cta_text: 'Learn More',
        external_link: '',
        media_file: null,
        media_type: 'image',
        media_preview: null,
        color_tone: '#6F3DCB',
        expires_at: '',
        product_id: null,
        service_id: null,
        destination_type: 'informative' // 'product', 'service', 'external', 'informative'
    });

    const handleCreate = async () => {
        if (!formData.template_id || !formData.title || !formData.media_file) {
            toast.error("Please fill in all required fields")
            return;
        }
        if (!formData.expires_at) {
            toast.error("Please set an expiry date for the ad")
            return;
        }
        
        // Validation based on destination type
        if (formData.destination_type === 'external' && !formData.external_link) {
            toast.error("External link is required for external destination")
            return;
        }
        if (formData.destination_type === 'product' && !formData.product_id) {
             toast.error("Please select a product")
             return;
        }
        if (formData.destination_type === 'service' && !formData.service_id) {
             toast.error("Please select a service")
             return;
        }


        try {
            const publicUrl = await uploadMedia(formData.media_file);
            
            if (!publicUrl) throw new Error('Upload failed');

            const { error } = await supabase.from('ads').insert([{
                title: formData.title,
                description: formData.description,
                cta_text: formData.cta_text,
                external_link: formData.destination_type === 'external' ? formData.external_link : null,
                image_url: publicUrl,
                media_type: formData.media_type,
                template_id: formData.template_id,
                user_id: (await supabase.auth.getUser()).data.user.id,
                status: 'approved',
                product_id: formData.destination_type === 'product' ? formData.product_id : null,
                service_id: formData.destination_type === 'service' ? formData.service_id : null,
                by_admin: true,
                is_paused: false,
                admin_paused: false,
                expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
                color_tone: formData.color_tone,
            }]);

            if (error) throw error;

            toast.success("Ad created successfully!")
            navigate('/admin/marketplace/ads');

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to create ad')
        }
    };

    return (
        <div className="pt-6 w-full flex flex-col">

            <PathHeader
                paths={[
                    { type: 'text', text: 'Ads' },
                    { type: 'text', text: 'Create' },
                ]}
            />

            <div className="flex items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Create New Ad</h1>
                    <p className="text-gray-500">Step {step} of 3</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {step === 1 && (
                        <AdTemplateSelector 
                            selected={formData.template_id}
                            onSelect={(id) => setFormData({...formData, template_id: id})}
                            onNext={() => setStep(2)}
                        />
                    )}
                    
                    {step === 2 && (
                        <AdCustomization 
                            data={formData}
                            onChange={setFormData}
                            onBack={() => setStep(1)}
                            onNext={() => setStep(3)}
                        />
                    )}

                    {step === 3 && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg mb-4">Review & Publish</h3>
                            <p className="text-gray-600 mb-6">
                                Please review your ad details on the preview pane. Once published, ads can only be paused, not deleted.
                            </p>
                            
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={isUploading}
                                    className="flex-1 bg-[#6F3DCB] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#5b32a8] transition shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUploading ? 'Uploading Media...' : 'Publish Ad'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <AdPreview data={formData} />
                    </div>
                </div>
            </div>

            {isUploading && (
                <div className="fixed bottom-6 right-6 bg-white p-4 rounded-xl shadow-2xl border border-purple-100 w-80 animate-slide-up z-50">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold text-gray-800">Uploading Media...</span>
                        <span className="text-sm text-[#6F3DCB] font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#6F3DCB] transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                    <p className="text-xs text-red-500 mt-2 font-medium">
                        ⚠️ Do not close this window
                    </p>
                </div>
            )}
        </div>
    );
}
