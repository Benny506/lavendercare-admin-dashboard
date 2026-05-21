import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../../redux/slices/appLoadingSlice";
import { subtleLoadStart, subtleLoadStop } from "../../../../redux/slices/subtleLoaderSlice";
import { setPageContent, selectPageContent, setUnsavedChanges, selectUnsavedChanges } from "../../../../redux/slices/siteContentSlice";
import { toast } from "react-toastify";
import supabase from "../../../../database/dbInit";
import PathHeader from "../../components/PathHeader";
import ConfirmModal from "../../components/ConfirmModal";
import Collapse from "../../components/Collapse";
import { FaExclamationTriangle, FaChevronDown, FaChevronUp, FaImage } from "react-icons/fa";
import * as FiIcons from "react-icons/fi";
import { optimizeImage } from "../../../../lib/imageOptimization";

const AVAILABLE_ICONS = [
    'FiHeart', 'FiUsers', 'FiShield', 'FiActivity', 'FiClock', 'FiSmile', 'FiVideo', 
    'FiFileText', 'FiPhoneCall', 'FiMail', 'FiMapPin', 'FiAward', 'FiCheckCircle', 
    'FiStar', 'FiTrendingUp', 'FiGlobe', 'FiBriefcase', 'FiHome', 'FiInfo', 'FiLink'
];

const CustomIconDropdown = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const displayIcons = [...AVAILABLE_ICONS];
    if (value && !displayIcons.includes(value)) {
        displayIcons.unshift(value);
    }

    const CurrentIcon = FiIcons[value] || FiIcons['FiStar'];

    return (
        <div className="relative w-full sm:w-64">
            <div 
                className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 cursor-pointer bg-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    {CurrentIcon && <CurrentIcon className="text-[#6F3DCB]" />}
                    <span className="text-sm text-gray-700">{value || 'Select an Icon'}</span>
                </div>
                <FaChevronDown className="text-gray-400 text-xs" />
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full left-0 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        {displayIcons.map(iconName => {
                            const IconCmp = FiIcons[iconName];
                            if (!IconCmp) return null;
                            return (
                                <div 
                                    key={iconName}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => {
                                        onChange(iconName);
                                        setIsOpen(false);
                                    }}
                                >
                                    <IconCmp className="text-[#6F3DCB]" />
                                    <span className="text-sm text-gray-700">{iconName}</span>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

const PAGES = [
    { id: 'homepage', label: 'Home Page' },
    { id: 'about', label: 'About Page' },
    { id: 'contact', label: 'Contact Page' },
    { id: 'partners', label: 'Partners Page' }
];

const SectionAccordion = ({ sectionKey, index, formData, renderField }) => {
    const [isOpen, setIsOpen] = useState(index === 0);
    return (
        <div className="border-b border-gray-100 last:border-b-0">
            <Collapse 
                isOpen={isOpen}
                onToggle={setIsOpen}
                header={
                    <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition">
                        <span className="font-semibold text-gray-800 capitalize text-lg">
                            {sectionKey.replace(/([A-Z])/g, ' $1').trim()} Section
                        </span>
                        {isOpen ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                    </div>
                }
            >
                <div className="p-6 bg-white">
                    {renderField(sectionKey, formData[sectionKey], sectionKey)}
                </div>
            </Collapse>
        </div>
    );
};

export default function SiteContentEditor() {
    const dispatch = useDispatch();
    const unsavedChanges = useSelector(selectUnsavedChanges);

    const [selectedPage, setSelectedPage] = useState('homepage');
    const [formData, setFormData] = useState(null);
    const [pendingPage, setPendingPage] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    
    // files map: path -> File
    const [pendingFiles, setPendingFiles] = useState({});

    useEffect(() => {
        fetchContent('homepage');
    }, []);

    const fetchContent = async (pageId) => {
        dispatch(subtleLoadStart());
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('*')
                .eq('id', pageId)
                .single();

            if (error) throw error;

            dispatch(setPageContent({ pageId, content: data.sections }));
            setFormData(JSON.parse(JSON.stringify(data.sections)));
            dispatch(setUnsavedChanges(false));
            setPendingFiles({});
            setSelectedPage(pageId);
        } catch (error) {
            console.error("Error fetching site content:", error);
            toast.error("Failed to load page content.");
        } finally {
            dispatch(subtleLoadStop());
        }
    };

    const handlePageChange = (e) => {
        const newPageId = e.target.value;
        if (newPageId === selectedPage) return;
        
        if (unsavedChanges) {
            setPendingPage(newPageId);
            setShowConfirm(true);
        } else {
            fetchContent(newPageId);
        }
    };

    const confirmLeave = () => {
        setShowConfirm(false);
        fetchContent(pendingPage);
    };

    const cancelLeave = () => {
        setShowConfirm(false);
        setPendingPage(null);
    };

    const setNestedValue = (obj, path, value) => {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    };

    const handleFieldChange = (path, value) => {
        const newData = JSON.parse(JSON.stringify(formData));
        setNestedValue(newData, path, value);
        setFormData(newData);
        dispatch(setUnsavedChanges(true));
    };

    const handleFileSelect = (path, file) => {
        if (!file) return;
        setPendingFiles(prev => ({ ...prev, [path]: file }));
        dispatch(setUnsavedChanges(true));
    };

    const handleSave = async () => {
        if (!formData) return;
        dispatch(appLoadStart());
        try {
            const newFormData = JSON.parse(JSON.stringify(formData));
            
            // Upload pending files
            for (const [path, file] of Object.entries(pendingFiles)) {
                const optimizedFile = await optimizeImage(file);
                
                const fileExt = optimizedFile.name.split('.').pop();
                const fileName = `${selectedPage}_${Date.now()}_${Math.floor(Math.random()*1000)}.${fileExt}`;
                
                const { error: uploadError } = await supabase.storage.from('site_content').upload(fileName, optimizedFile, {
                    upsert: false
                });

                if (uploadError) throw uploadError;

                const { data: publicData } = supabase.storage.from('site_content').getPublicUrl(fileName);
                setNestedValue(newFormData, path, publicData.publicUrl);
            }

            // Update database
            const { error: dbError } = await supabase
                .from('site_content')
                .update({ sections: newFormData })
                .eq('id', selectedPage);

            if (dbError) throw dbError;

            dispatch(setPageContent({ pageId: selectedPage, content: newFormData }));
            setFormData(newFormData);
            dispatch(setUnsavedChanges(false));
            setPendingFiles({});
            toast.success("Page content updated successfully!");
        } catch (error) {
            console.error("Save error:", error);
            toast.error("An error occurred while saving.");
        } finally {
            dispatch(appLoadStop());
        }
    };

    const isImageField = (key, val) => {
        if (typeof val === 'string' && /\.(png|jpe?g|svg|webp|gif)$/i.test(val)) return true;
        if (key.toLowerCase().includes('image') || key.toLowerCase().includes('logo') || key.toLowerCase().includes('banner')) return true;
        return false;
    };

    const resolveMediaUrl = (val, path) => {
        if (pendingFiles[path]) {
            return URL.createObjectURL(pendingFiles[path]);
        }
        if (val?.startsWith('http')) return val;
        if (val) {
            const { data } = supabase.storage.from('site_content').getPublicUrl(val);
            return data?.publicUrl || '';
        }
        return '';
    };

    const renderField = (key, value, path) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return (
                <div key={path} className="mb-4 ml-4 border-l-2 border-gray-100 pl-4">
                    <div className="font-semibold text-gray-700 capitalize mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    {Object.entries(value).map(([subKey, subVal]) => renderField(subKey, subVal, `${path}.${subKey}`))}
                </div>
            );
        }

        if (Array.isArray(value)) {
            return (
                <div key={path} className="mb-4 ml-4 border-l-2 border-gray-100 pl-4">
                    <div className="font-semibold text-gray-700 capitalize mb-2">{key.replace(/([A-Z])/g, ' $1').trim()} (List)</div>
                    {value.map((item, index) => (
                        <div key={`${path}.${index}`} className="mb-4 bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs text-gray-500 font-bold mb-2">Item {index + 1}</div>
                            {typeof item === 'object' 
                                ? Object.entries(item).map(([subKey, subVal]) => renderField(subKey, subVal, `${path}.${index}.${subKey}`))
                                : renderField(`Item ${index + 1}`, item, `${path}.${index}`)}
                        </div>
                    ))}
                </div>
            );
        }

        // Image Field
        if (isImageField(key, value)) {
            const previewUrl = resolveMediaUrl(value, path);
            return (
                <div key={path} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="flex items-start gap-4 mt-2">
                        <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                            {previewUrl ? (
                                <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                                <FaImage className="text-gray-400 text-3xl" />
                            )}
                        </div>
                        <div className="flex-1">
                            <input 
                                id={`file-input-${path}`}
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleFileSelect(path, e.target.files[0])}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            />
                            <div className="flex items-center gap-4 mt-2">
                                <p className="text-xs text-gray-500">Recommended: .webp, .png, .jpg (Max width: 800px)</p>
                                {pendingFiles[path] && (
                                    <button
                                        onClick={() => {
                                            setPendingFiles(prev => {
                                                const newFiles = { ...prev };
                                                delete newFiles[path];
                                                return newFiles;
                                            });
                                            const fileInput = document.getElementById(`file-input-${path}`);
                                            if (fileInput) fileInput.value = "";
                                        }}
                                        className="text-xs text-red-500 font-medium hover:underline cursor-pointer"
                                    >
                                        Revert to initial image
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Icon Field
        if (key.toLowerCase() === 'icon' || key.toLowerCase().includes('icon')) {
            return (
                <div key={path} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <CustomIconDropdown 
                        value={value} 
                        onChange={(newIcon) => handleFieldChange(path, newIcon)} 
                    />
                </div>
            );
        }

        // ID Field (Non-editable)
        if (key.toLowerCase() === 'id') {
            return (
                <div key={path} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()} (System Identifier)
                    </label>
                    <input
                        type="text"
                        value={value || ''}
                        readOnly
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
                    />
                </div>
            );
        }

        // Text Field
        return (
            <div key={path} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {typeof value === 'string' && value.length > 50 ? (
                    <textarea
                        value={value}
                        onChange={(e) => handleFieldChange(path, e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6F3DCB]"
                        rows={4}
                    />
                ) : (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(path, e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#6F3DCB]"
                    />
                )}
            </div>
        );
    };

    return (
        <div className="pt-6 w-full min-h-screen">
            <PathHeader paths={[{ text: 'Website' }, { text: 'Content Editor' }]} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Site Content Editor</h2>
                    <p className="text-sm text-gray-500">Edit the text and media for your website pages.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <select 
                        value={selectedPage} 
                        onChange={handlePageChange}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F3DCB]"
                    >
                        {PAGES.map(p => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleSave}
                        disabled={!unsavedChanges}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
                            unsavedChanges ? 'bg-[#6F3DCB] text-white hover:bg-[#5a31a5]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {formData ? (
                    Object.keys(formData).map((sectionKey, index) => (
                        <SectionAccordion 
                            key={sectionKey}
                            sectionKey={sectionKey}
                            index={index}
                            formData={formData}
                            renderField={renderField}
                        />
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">Loading page content...</div>
                )}
            </div>

            <ConfirmModal 
                modalProps={{
                    visible: showConfirm,
                    hide: () => setShowConfirm(false),
                    data: {
                        title: "Unsaved Changes",
                        msg: "You have unsaved changes. If you switch pages now, your edits will be lost. Do you want to proceed?",
                        icon: <FaExclamationTriangle className="text-amber-500" />,
                        yesText: "Discard Changes",
                        noText: "Stay on Page",
                        yesColorClass: "bg-amber-500 text-white hover:bg-amber-600",
                        yesFunc: confirmLeave,
                        noFunc: cancelLeave
                    }
                }} 
            />
        </div>
    );
}
