import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaPause, FaPlay, FaEdit, FaEye, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { appLoadStart, appLoadStop } from '../../../../redux/slices/appLoadingSlice';
import { toast } from 'react-toastify';
import supabase from '../../../../database/dbInit';
import PathHeader from '../../components/PathHeader';
import AdPreview from './components/AdPreview';
import Ad_Temp1 from './components/templates/Ad_Temp1';
import Ad_Temp2 from './components/templates/Ad_Temp2';
import Ad_Temp3 from './components/templates/Ad_Temp3';
import Ad_Temp4 from './components/templates/Ad_Temp4';
import Ad_Temp5 from './components/templates/Ad_Temp5';
import Ad_Temp6 from './components/templates/Ad_Temp6';
import Ad_Temp7 from './components/templates/Ad_Temp7';
import Ad_Temp8 from './components/templates/Ad_Temp8';
import Ad_Temp9 from './components/templates/Ad_Temp9';
import Ad_Temp10 from './components/templates/Ad_Temp10';

export default function AdsList() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ads, setAds] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [previewAd, setPreviewAd] = useState(null);

    const fetchAds = useCallback(async () => {
        try {
            dispatch(appLoadStart());
            const { data, error } = await supabase
                .from('ads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAds(data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch ads")
        } finally {
            dispatch(appLoadStop());
        }
    }, [dispatch]);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    useEffect(() => {
        if (!previewAd) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setPreviewAd(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [previewAd]);

    const normalizeAd = (ad) => {
        const destination_type = ad?.destination_type
            || (ad?.product_id ? 'product' : ad?.service_id ? 'service' : ad?.external_link ? 'external' : 'informative');
        return {
            ...ad,
            destination_type,
            color_tone: ad?.color_tone || '#6F3DCB',
        };
    };

    const handlePauseToggle = async (ad) => {
        try {
            dispatch(appLoadStart());
            const newStatus = !ad.is_paused;

            const { error } = await supabase
                .from('ads')
                .update({ is_paused: newStatus })
                .eq('id', ad.id);

            if (error) throw error;

            setAds(ads.map(a => a.id === ad.id ? { ...a, is_paused: newStatus } : a));

            toast.success(`Ad ${newStatus ? 'paused' : 'resumed'} successfully`)

        } catch (error) {
            console.error(error);
            toast.error("Failed to update ad status")
        } finally {
            dispatch(appLoadStop());
        }
    };

    const filteredAds = ads.filter(ad => {
        const matchesSearch = (ad.title || '').toLowerCase().includes(search.toLowerCase());
        if (filter === 'all') return matchesSearch;
        if (filter === 'active') return matchesSearch && !ad.is_paused && ad.status === 'approved';
        if (filter === 'paused') return matchesSearch && ad.is_paused;
        if (filter === 'pending') return matchesSearch && ad.status === 'pending';
        return matchesSearch;
    });

    const templateMap = {
        template_1: Ad_Temp1,
        template_2: Ad_Temp2,
        template_3: Ad_Temp3,
        template_4: Ad_Temp4,
        template_5: Ad_Temp5,
        template_6: Ad_Temp6,
        template_7: Ad_Temp7,
        template_8: Ad_Temp8,
        template_9: Ad_Temp9,
        template_10: Ad_Temp10,
    };

    return (
        <div className="pt-6 w-full flex flex-col">

            <PathHeader
                paths={[
                    { type: 'text', text: 'Ads' },
                ]}
            />

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Ads Management</h1>
                    <p className="text-gray-500 mt-1">Create and manage your advertisement campaigns</p>
                </div>
                <button
                    onClick={() => navigate('/admin/marketplace/ads/create')}
                    className="flex items-center gap-2 bg-[#6F3DCB] text-white px-6 py-3 rounded-xl hover:bg-[#5b32a8] transition shadow-lg shadow-purple-200"
                >
                    <FaPlus size={14} />
                    <span>Create New Ad</span>
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
                    {['all', 'active', 'paused', 'pending'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${filter === f
                                    ? 'bg-white text-[#6F3DCB] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search ads..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F3DCB]/20"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAds.map(ad => {
                    const normalizedAd = normalizeAd(ad);
                    const TemplateComponent = templateMap[normalizedAd.template_id] || Ad_Temp1;
                    return (
                        <div
                            key={ad.id}
                            onClick={() => setPreviewAd((prev) => (prev?.id === ad.id ? null : ad))}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group cursor-pointer"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') setPreviewAd((prev) => (prev?.id === ad.id ? null : ad));
                            }}
                        >
                            <div className="h-56 bg-gray-50 relative overflow-hidden">
                                <div className="absolute inset-0 p-3">
                                    <div className="w-[340px] origin-top-left scale-[0.72]">
                                        <TemplateComponent data={normalizedAd} autoplayMedia={false} />
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <div className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur">
                                        <FaEye />
                                    </div>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${ad.is_paused
                                            ? 'bg-yellow-500/20 text-yellow-700 border border-yellow-200'
                                            : ad.status === 'approved'
                                                ? 'bg-green-500/20 text-green-700 border border-green-200'
                                                : 'bg-gray-500/20 text-gray-700 border border-gray-200'
                                        }`}>
                                        {ad.is_paused ? 'Paused' : ad.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{ad.title}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{ad.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
                                    <div>
                                        <span className="text-xs text-gray-400 block">Impressions</span>
                                        <span className="font-bold text-gray-700">{ad.impressions_count || 0}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400 block">Clicks</span>
                                        <span className="font-bold text-gray-700">{ad.clicks_count || 0}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-gray-50">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/admin/marketplace/ads/edit`, { state: { ad } });
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
                                        type="button"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePauseToggle(ad);
                                        }}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition text-sm font-medium ${ad.is_paused
                                                ? 'text-green-600 hover:bg-green-50'
                                                : 'text-yellow-600 hover:bg-yellow-50'
                                            }`}
                                        type="button"
                                    >
                                        {ad.is_paused ? <><FaPlay /> Resume</> : <><FaPause /> Pause</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredAds.length === 0 && (
                <div className="text-center py-20">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaSearch size={24} className="text-gray-300" />
                    </div>
                    <h3 className="text-gray-800 font-bold text-lg">No ads found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search query</p>
                </div>
            )}

            {previewAd && (
                <div
                    style={{
                        zIndex: 1000
                    }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setPreviewAd(null)}
                >
                    <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            onClick={() => setPreviewAd(null)}
                            className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition z-10"
                        >
                            <FaTimes />
                        </button>
                        <AdPreview data={normalizeAd(previewAd)} />
                    </div>
                </div>
            )}
        </div>
    );
}
