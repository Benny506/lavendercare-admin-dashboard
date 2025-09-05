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

export default function VendorInfo({ vendor }) {
    const dispatch = useDispatch()

    if (!vendor) return <></>

    return (
        <div className="bg-white rounded-xl w-full max-w-xs flex-shrink-0 flex flex-col gap-6 items-center lg:items-start">
            <div className="flex flex-wrap gap-2 items-center justify-start lg:items-start w-full">
                <ProfileImg
                    profile_img={vendor?.profile_img}
                    name={vendor?.business_name}
                    size='12'
                />
                <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-lg">{vendor?.business_name}</span>
                    <span className="font-light text-sm text-gray-600">{vendor?.location}</span>
                </div>
            </div>

            <div
                style={{
                    borderBottom: '1px solid gray'
                }}
                className="w-full pb-6"
            >
                <div className="text-lg font-medium text-black mb-4">Bio</div>
                <p className="text-gray-600 m-0 p-0 font-medium text-sm">
                    {vendor?.bio || 'Not set'}
                </p>
            </div>

            <div
                style={{
                    borderBottom: '1px solid gray'
                }}
                className="w-full pb-6"
            >
                <div className="text-lg font-medium text-black mb-4">Basic Info</div>

                {
                    [
                        { Icon: () => <FaPhone color="gray" size={15} />, value: vendor?.phone_number || 'Not set' },
                        { Icon: () => <MdEmail color="gray" size={15} />, value: vendor?.email || 'Not set' },
                        { Icon: () => <FaLocationArrow color="gray" size={15} />, value: vendor?.location || 'Not set' },
                    ]
                        .map((s, i) => {
                            const { Icon, value } = s

                            return (
                                <div
                                    key={i}
                                    className="text-sm mb-2 flex gap-2 items-center"
                                >
                                    <Icon /> <span className="font-medium text-gray-600">{value}</span>
                                </div>
                            )
                        })
                }
            </div>    

            <div
                style={{
                    borderBottom: '1px solid gray'
                }}
                className="w-full pb-6"
            >
                <div className="text-lg font-medium text-black mb-4">Working condition</div>
                <p className="text-gray-600 m-0 p-0 font-medium text-sm">
                    {vendor?.working_condition || 'Not set'}
                </p>
            </div>                             
        </div>
    )
}