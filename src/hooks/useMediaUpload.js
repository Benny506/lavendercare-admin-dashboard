import React, { useState } from 'react';
import supabase from '../database/dbInit';

export default function useMediaUpload() {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const uploadMedia = async (file) => {
        if (!file) return null;
        
        setIsUploading(true);
        setUploadProgress(0);

        try {
            const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
            const { data, error } = await supabase.storage
                .from('ads_media')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            for (let i = 0; i <= 100; i += 10) {
                setUploadProgress(i);
                await new Promise(r => setTimeout(r, 50));
            }

            const { data: publicData } = supabase.storage
                .from('ads_media')
                .getPublicUrl(fileName);

            return publicData.publicUrl;

        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadMedia, uploadProgress, isUploading };
}
