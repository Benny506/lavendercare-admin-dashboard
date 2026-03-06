import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import AdTemplateSelector from './components/AdTemplateSelector';
import AdCustomization from './components/AdCustomization';
import AdPreview from './components/AdPreview';
import supabase from '../../../../database/dbInit';
import { toast } from 'react-toastify';
import useMediaUpload from '../../../../hooks/useMediaUpload';
import PathHeader from '../../components/PathHeader';

export default function EditAd() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { uploadMedia, uploadProgress, isUploading } = useMediaUpload();
    
    // Initial state from passed ad object
    const [formData, setFormData] = useState(state?.ad || {});

    const handleUpdate = async () => {
        try {
            let publicUrl = formData.image_url;

            // Only upload if a new file is selected (media_file exists in state)
            if (formData.media_file) {
                publicUrl = await uploadMedia(formData.media_file);
                if (!publicUrl) throw new Error('Upload failed');
            }

            const { error } = await supabase
                .from('ads')
                .update({
                    title: formData.title,
                    description: formData.description,
                    template_id: formData.template_id,
                    cta_text: formData.cta_text,
                    external_link: formData.external_link,
                    image_url: publicUrl,
                    media_type: formData.media_type,
                    color_tone: formData.color_tone,
                    expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
                })
                .eq('id', formData.id);

            if (error) throw error;

            toast.success("Ad updated successfully!")
            navigate('/admin/marketplace/ads');

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to update ad')
        }
    };

    if (!state?.ad) {
        navigate('/admin/marketplace/ads');
        return null;
    }

    return (
        <div className="pt-6 w-full flex flex-col">

            <PathHeader
                paths={[
                    { type: 'text', text: 'Ads' },
                    { type: 'text', text: 'Edit' },
                ]}
            />

            <div className="flex items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Edit Ad</h1>
                    <p className="text-gray-500">Update campaign details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4">Change Template</h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            You can switch the ad’s layout. Preview updates on the right.
                        </p>
                        <AdTemplateSelector
                            selected={formData.template_id}
                            onSelect={(id) => setFormData({ ...formData, template_id: id })}
                            hideContinueBtn={true}
                        />
                    </div>

                    <AdCustomization 
                        data={formData}
                        onChange={setFormData}
                        isEditMode={true}
                    />
                    
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={isUploading}
                            className="flex-1 bg-[#6F3DCB] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#5b32a8] transition shadow-lg shadow-purple-200 disabled:opacity-50"
                        >
                            {isUploading ? 'Uploading...' : 'Save Changes'}
                        </button>
                    </div>
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
                </div>
            )}
        </div>
    );
}
