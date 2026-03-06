import React from 'react';
import { FaCheck } from 'react-icons/fa';

// 1. Standard Card
// 2. Full Image Overlay
// 3. Left Media, Right Content (Horizontal)
// 4. Minimalist (No Border, Clean)
// 5. Bold Bordered
// 6. Floating Card (Shadow Heavy)
// 7. Dark Mode (Inverted)
// 8. Bottom Media (Content Top)
// 9. Gradient Background
// 10. Compact Banner (Small Height)

const templates = [
    { id: 'template_1', name: 'Standard', type: 'standard' },
    { id: 'template_2', name: 'Full Overlay', type: 'overlay' },
    { id: 'template_3', name: 'Horizontal', type: 'horizontal' },
    { id: 'template_4', name: 'Minimalist', type: 'minimal' },
    { id: 'template_5', name: 'Bordered', type: 'bordered' },
    { id: 'template_6', name: 'Floating', type: 'floating' },
    { id: 'template_7', name: 'Dark', type: 'dark' },
    { id: 'template_8', name: 'Content First', type: 'reverse' },
    { id: 'template_9', name: 'Gradient', type: 'gradient' },
    { id: 'template_10', name: 'Compact', type: 'compact' },
];

const TemplatePreview = ({ type, selected }) => {
    // Helper to simulate layout structure in miniature
    const baseClass = "w-full h-full p-2 flex flex-col relative overflow-hidden transition-all";
    
    switch (type) {
        case 'standard':
            return (
                <div className={`${baseClass} bg-white border border-gray-200`}>
                    <div className="w-full h-1/2 bg-gray-200 rounded-sm mb-2"></div>
                    <div className="w-3/4 h-2 bg-gray-300 rounded mb-1"></div>
                    <div className="w-full h-1 bg-gray-200 rounded mb-1"></div>
                    <div className="w-1/2 h-3 bg-blue-100 rounded mt-auto"></div>
                </div>
            );
        case 'overlay':
            return (
                <div className={`${baseClass} bg-gray-800`}>
                     <div className="absolute inset-0 bg-gray-600 opacity-50"></div>
                     <div className="relative z-10 mt-auto text-white">
                        <div className="w-3/4 h-2 bg-white/80 rounded mb-1"></div>
                        <div className="w-full h-1 bg-white/40 rounded mb-2"></div>
                        <div className="w-full h-3 bg-white/20 rounded"></div>
                     </div>
                </div>
            );
        case 'horizontal':
            return (
                <div className={`${baseClass} bg-white border border-gray-200 flex-row gap-2`}>
                    <div className="w-1/3 h-full bg-gray-200 rounded-sm"></div>
                    <div className="flex-1 flex flex-col justify-center">
                         <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
                         <div className="w-full h-1 bg-gray-200 rounded mb-2"></div>
                         <div className="w-full h-3 bg-blue-100 rounded"></div>
                    </div>
                </div>
            );
        case 'minimal':
            return (
                <div className={`${baseClass} bg-gray-50`}>
                    <div className="w-full h-1/2 bg-gray-200 rounded-lg mb-2"></div>
                    <div className="text-center">
                        <div className="w-1/2 h-2 bg-gray-400 rounded mx-auto mb-1"></div>
                        <div className="w-3/4 h-1 bg-gray-300 rounded mx-auto"></div>
                    </div>
                </div>
            );
        case 'bordered':
            return (
                <div className={`${baseClass} bg-white border-2 border-gray-900`}>
                    <div className="w-full h-1/2 bg-gray-200 mb-2 border-b-2 border-gray-900"></div>
                    <div className="w-2/3 h-2 bg-gray-800 rounded mb-1"></div>
                    <div className="w-full h-3 bg-gray-900 rounded mt-auto"></div>
                </div>
            );
        case 'floating':
            return (
                <div className={`${baseClass} bg-white shadow-lg rounded-lg scale-90`}>
                     <div className="w-full h-1/2 bg-gray-200 rounded-t-lg mb-2"></div>
                     <div className="px-1">
                        <div className="w-3/4 h-2 bg-gray-300 rounded mb-1"></div>
                        <div className="w-full h-3 bg-blue-500 rounded mt-auto"></div>
                     </div>
                </div>
            );
        case 'dark':
             return (
                <div className={`${baseClass} bg-gray-900 border border-gray-700`}>
                    <div className="w-full h-1/2 bg-gray-800 rounded-sm mb-2"></div>
                    <div className="w-3/4 h-2 bg-gray-500 rounded mb-1"></div>
                    <div className="w-1/2 h-3 bg-purple-900 rounded mt-auto"></div>
                </div>
            );
        case 'reverse':
             return (
                <div className={`${baseClass} bg-white border border-gray-200 justify-end`}>
                     <div className="mb-auto">
                        <div className="w-3/4 h-2 bg-gray-300 rounded mb-1"></div>
                        <div className="w-full h-1 bg-gray-200 rounded mb-2"></div>
                     </div>
                    <div className="w-full h-1/2 bg-gray-200 rounded-sm mt-2"></div>
                </div>
            );
        case 'gradient':
             return (
                <div className={`${baseClass} bg-gradient-to-br from-purple-400 to-blue-400`}>
                    <div className="w-full h-1/2 bg-white/30 backdrop-blur-sm rounded-lg mb-2"></div>
                    <div className="w-3/4 h-2 bg-white/80 rounded mb-1"></div>
                    <div className="w-full h-3 bg-white rounded mt-auto"></div>
                </div>
            );
        case 'compact':
             return (
                <div className={`${baseClass} bg-white border border-gray-200 justify-center`}>
                    <div className="flex items-center gap-2">
                         <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0"></div>
                         <div className="flex-1">
                             <div className="w-3/4 h-2 bg-gray-300 rounded mb-1"></div>
                             <div className="w-full h-1 bg-gray-200 rounded"></div>
                         </div>
                    </div>
                </div>
            );
        default:
            return <div className="bg-gray-100 w-full h-full"></div>;
    }
}

export default function AdTemplateSelector({ selected, onSelect, onNext }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4">Select a Template</h3>
            <p className="text-gray-500 mb-6 text-sm">Choose a layout style. The preview on the right will update instantly.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onSelect(template.id)}
                        className={`relative w-full aspect-[16/9] rounded-xl transition-all overflow-hidden group p-2 flex flex-col items-center text-left ${
                            selected === template.id 
                                ? 'ring-4 ring-[#6F3DCB]/30 scale-[1.02] bg-purple-50' 
                                : 'hover:scale-[1.01] hover:shadow-md bg-gray-50'
                        }`}
                    >
                        {/* Miniature layout preview */}
                        <div className="w-full flex-1 rounded overflow-hidden shadow-sm mb-2">
                             <TemplatePreview type={template.type} selected={selected === template.id} />
                        </div>

                        <div className="w-full text-xs font-bold text-gray-600 px-1 truncate">
                            {template.name}
                        </div>
                        
                        {selected === template.id && (
                            <div className="absolute top-2 right-2 bg-[#6F3DCB] text-white p-1.5 rounded-full shadow-md z-10">
                                <FaCheck size={12} />
                            </div>
                        )}
                    </button>
                ))}
            </div>
            
            <div className="flex justify-end">
                <button
                    onClick={onNext}
                    disabled={!selected}
                    className="bg-[#6F3DCB] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#5b32a8] transition shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
