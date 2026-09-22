import { BsCalendar, BsPhone } from "react-icons/bs"
import ProfileImg from "../../components/ProfileImg"
import { FaLocationArrow, FaPhone, FaRegUserCircle } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import useApiReqs from "../../../../hooks/useApiReqs"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { appLoadStart, appLoadStop } from "../../../../redux/slices/appLoadingSlice"
import { toast } from "react-toastify"
import ZeroItems from "../../components/ZeroItems"
import { formatTimeToDuration, formatTimeToHHMMSS, timeToAMPM_FromHour } from "../../../../lib/utils"
import { vendorStatusColors } from "../../../../lib/utils_Jsx"
import { getPublicImageUrl } from "../../../../lib/requestApi"

export default function VendorInfo({ vendor }) {
    const dispatch = useDispatch()

    if (!vendor) return <></>

    const image_url = vendor?.profile_img ? getPublicImageUrl({ path: vendor?.profile_img, bucket_name: 'user_profiles' }) : null

    const formatTimeStr = (strr) => {
        if (strr === null || strr === undefined || strr === "") return "Closed";

        const str = String(strr);
        let h, m;

        if (str.includes(':')) {
            [h, m] = str.split(':');
        } else {
            h = str;
            m = '00';
        }

        let hour = parseInt(h, 10);
        if (isNaN(hour)) return "Closed";

        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;

        // Ensure minutes are 2 digits just in case
        if (!m || m.length === 1) m = "00";

        return `${hour}:${m} ${ampm}`;
    }

    const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

    return (
        <div className="bg-gradient-to-br from-indigo-50/60 via-white to-white rounded-3xl w-full flex flex-col gap-8 p-6 md:p-8 border border-indigo-100 shadow-sm relative overflow-hidden">
            {/* Background decorative blob */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none"></div>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center w-full relative z-10">
                <div className="ring-4 ring-white shadow-lg rounded-full shrink-0">
                    <ProfileImg
                        profile_img={image_url}
                        name={vendor?.username || vendor?.provider_name}
                        size='20'
                    />
                </div>
                <div className="flex flex-col items-start gap-3">
                    <h2 className="font-bold text-3xl text-gray-900 tracking-tight">
                        {vendor?.username || vendor?.provider_name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-1">
                        {vendor?.email && (
                            <div className="flex items-center gap-2.5 text-gray-600 text-sm font-medium">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm text-indigo-500 border border-gray-100">
                                    <MdEmail size={15} />
                                </div>
                                {vendor.email}
                            </div>
                        )}
                        {vendor?.phone && (
                            <div className="flex items-center gap-2.5 text-gray-600 text-sm font-medium">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm text-indigo-500 border border-gray-100">
                                    <FaPhone size={14} />
                                </div>
                                {vendor.phone}
                            </div>
                        )}
                        {(vendor?.location || vendor?.city) && (
                            <div className="flex items-center gap-2.5 text-gray-600 text-sm font-medium">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm text-indigo-500 border border-gray-100">
                                    <FaLocationArrow size={14} />
                                </div>
                                {[vendor?.city, vendor?.state, vendor?.country].filter(Boolean).join(", ")}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Availability Section */}
            {vendor?.availability && (
                <div className="w-full mt-2 relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2.5 bg-indigo-100/80 text-indigo-600 rounded-xl">
                            <BsCalendar size={18} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 tracking-wide">Working Hours</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                        {DAYS_ORDER.map((day) => {
                            const hours = vendor.availability[day];
                            const isAvailable = hours?.opening != null && hours?.opening !== "" && hours?.closing != null && hours?.closing !== "";

                            return (
                                <div
                                    key={day}
                                    className={`flex flex-col p-4 rounded-2xl border transition-all duration-300 ${isAvailable
                                        ? 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5'
                                        : 'bg-gray-50/60 border-transparent opacity-80'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gray-300'}`}></div>
                                        <span className={`capitalize font-semibold text-sm ${isAvailable ? 'text-gray-800' : 'text-gray-500'}`}>
                                            {day.slice(0, 3)}
                                        </span>
                                    </div>

                                    {isAvailable ? (
                                        <div className="flex flex-col mt-auto text-sm font-bold text-indigo-900 bg-indigo-50/50 p-2 rounded-lg text-center">
                                            <span>{formatTimeStr(hours.opening)}</span>
                                            <span className="text-gray-400 text-xs my-0.5">to</span>
                                            <span>{formatTimeStr(hours.closing)}</span>
                                        </div>
                                    ) : (
                                        <div className="mt-auto flex justify-center py-2 bg-gray-100/50 rounded-lg">
                                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Closed</span>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}