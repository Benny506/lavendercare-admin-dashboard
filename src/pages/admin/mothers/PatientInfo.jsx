import React, { useState } from 'react';
import ProfileImg from '../components/ProfileImg';
import { getRiskLevelBadge, getStatusBadge } from '../../../lib/utils_Jsx';
import { getPublicImageUrl } from '../../../lib/requestApi';

export default function PatientInfo({ screeningInfo, noMentalHealth }){

    const patient = screeningInfo?.user_profile

    if(!patient || !screeningInfo) return <></>

    const profile_img = getPublicImageUrl({ path: patient?.profile_img, bucket_name: 'user_profiles' })

    return (
        <div className="bg-white rounded-xl p-4 w-full max-w-xs flex-shrink-0 flex flex-col items-center lg:items-start">
            {
                screeningInfo?.risk_level
                &&
                    <div className='flex items-center justify-end mb-4 w-full'>
                        { getRiskLevelBadge(screeningInfo?.risk_level) }
                    </div>
            }

            <div className="flex flex-col items-center justify-start lg:items-start w-full">
                <ProfileImg 
                    profile_img={profile_img}
                    name={patient?.name}
                    size='12'
                />
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">{patient?.name}</span>
                </div>                              
            </div>

            <div className="w-full mt-2">
                <div className="text-sm text-gray-500 mb-5">Patient Information</div>
                {
                    [
                        { title: 'Age:', value: patient?.age || 'Not set', },
                        // { title: 'Postpartum Day:', value: patient?.postpartumDay || 'Not set' },
                        { title: 'Contact:', value: patient?.email || 'Not set' },
                        { title: 'Phone no:', value: patient?.phone_number || 'Not set' },
                        { title: 'Mother Type:', value: patient?.is_pregnant === null ? 'TTC' : patient?.is_pregnant ? 'Pregnant' : 'PostPartum' }
                    ]
                    .map((s, i) => {
                        const { title, value } = s

                        return (
                            <div
                                key={i}
                                className="text-sm mb-3"
                            >
                                {title} <span className="font-semibold">{ value }</span>
                            </div>
                        )
                    })
                }
            </div>
            
            {
                // !noMentalHealth
                // &&
                //     <div className="w-full mt-4">
                //         <div className="text-xs text-gray-500 mb-1">Attachments & Reports</div>
                //         <div className="text-xs mb-2">Mental Health Report</div>
                //         <button className="bg-purple-600 text-white px-4 py-2 rounded text-xs font-semibold w-full">Download PDF</button>
                //     </div>                
            }
        </div>
    );
};