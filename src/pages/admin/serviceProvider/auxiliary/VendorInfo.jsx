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

    return (
        <div className="bg-white rounded-xl w-full flex flex-col gap-6 items-start justify-start p-4">
            <div className="flex flex-wrap gap-2 items-center w-full">
                <ProfileImg
                    profile_img={image_url}
                    name={vendor?.username}
                    size='12'
                />
                <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-lg">{vendor?.username}</span>
                </div>
            </div>                           
        </div>
    )
}