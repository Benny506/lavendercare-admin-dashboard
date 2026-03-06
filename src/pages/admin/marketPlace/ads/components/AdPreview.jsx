import React from 'react'
import { FaWifi, FaBatteryFull, FaSignal } from 'react-icons/fa'
import Ad_Temp1 from './templates/Ad_Temp1'
import Ad_Temp2 from './templates/Ad_Temp2'
import Ad_Temp3 from './templates/Ad_Temp3'
import Ad_Temp4 from './templates/Ad_Temp4'
import Ad_Temp5 from './templates/Ad_Temp5'
import Ad_Temp6 from './templates/Ad_Temp6'
import Ad_Temp7 from './templates/Ad_Temp7'
import Ad_Temp8 from './templates/Ad_Temp8'
import Ad_Temp9 from './templates/Ad_Temp9'
import Ad_Temp10 from './templates/Ad_Temp10'
import AdTemplateCta from './templates/AdTemplateCta'

export default function AdPreview({ data }) {
    const TemplateComponent = {
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
    }[data?.template_id] || Ad_Temp1

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-lg mb-6">Mobile Preview</h3>
            
            {/* Phone Frame */}
            <div className="mx-auto w-[280px] h-[580px] bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl relative overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>

                {/* Status Bar */}
                <div className="flex justify-between items-center px-5 pt-3 text-white text-[10px] z-10 relative">
                    <span>9:41</span>
                    <div className="flex gap-1">
                        <FaSignal />
                        <FaWifi />
                        <FaBatteryFull />
                    </div>
                </div>

                {/* Screen Content - App Shell */}
                <div className="bg-gray-50 h-full pt-10 px-3 pb-4 flex flex-col relative">
                    
                    {/* AD PLACEMENT - TOP OF SCREEN */}
                    <div className="mb-4 relative group animate-fade-in">
                        {/* Ad Label */}
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-[8px] px-1.5 py-0.5 rounded backdrop-blur-sm z-10">
                            Sponsored
                        </div>

                        <TemplateComponent data={data} />
                        {data?.destination_type !== 'informative' && (
                          <div className="mt-3">
                            <AdTemplateCta
                              data={data}
                              className="w-full py-2 rounded-lg text-xs font-bold text-white transition-opacity active:opacity-90 shadow-sm"
                            />
                          </div>
                        )}
                    </div>

                    {/* Placeholder App Content Below Ad */}
                    <div className="space-y-3 flex-1 overflow-hidden opacity-50">
                        {/* Header Placeholder */}
                         <div className="flex justify-between items-center mb-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <div className="w-24 h-4 bg-gray-300 rounded-full"></div>
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        </div>
                        
                        <div className="h-24 bg-gray-200 rounded-xl"></div>
                        <div className="h-24 bg-gray-200 rounded-xl"></div>
                        <div className="h-24 bg-gray-200 rounded-xl"></div>
                    </div>
                    
                    {/* Tab Bar Placeholder */}
                    <div className="h-12 bg-white border-t border-gray-200 flex justify-around items-center px-4 mt-auto rounded-b-2xl absolute bottom-0 left-0 right-0">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`w-6 h-6 rounded-full ${i===1 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                        ))}
                    </div>

                </div>
            </div>
            
            <p className="text-center text-xs text-gray-400 mt-4">
                Preview of how the ad appears at the top of the feed
            </p>
        </div>
    );
}
