import { BsCalendar, BsPhone } from "react-icons/bs"
import ProfileImg from "../../components/ProfileImg"
import { FaPhone, FaRegUserCircle } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import useApiReqs from "../../../../hooks/useApiReqs"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { appLoadStart, appLoadStop } from "../../../../redux/slices/appLoadingSlice"
import { toast } from "react-toastify"
import ZeroItems from "../../components/ZeroItems"
import { formatTimeToDuration, formatTimeToHHMMSS, secondsToLabel, timeToAMPM_FromHour } from "../../../../lib/utils"
import { getStatusBadge, providerStatus, providerStatusColors } from "../../../../lib/utils_Jsx"

export default function ProviderInfo({ provider }) {
    const dispatch = useDispatch()

    const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
    const [availability, setAvailability] = useState()
    const [bookingCostOptions, setBookingCostOptions] = useState()

    if (!provider) return <></>

    return (
        <div className="bg-white rounded-xl w-full max-w-xs flex-shrink-0 flex flex-col gap-6 items-center lg:items-start">
            <div className={`${providerStatusColors[provider?.status]}`}>
                {provider?.status}
            </div>

            <div className="flex flex-wrap gap-2 items-center justify-start lg:items-start w-full">
                <ProfileImg
                    profile_img={provider?.profile_img}
                    name={provider?.provider_name}
                    size='12'
                />
                <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-lg">{provider?.provider_name}</span>
                    <span className="font-light text-sm text-gray-600">{provider?.professional_title}</span>
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
                    {provider?.provider_bio || 'Not set'}
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
                        { Icon: () => <FaPhone color="gray" size={15} />, value: provider?.phone_number || 'Not set' },
                        { Icon: () => <MdEmail color="gray" size={15} />, value: provider?.email || 'Not set' },
                        { Icon: () => <BsCalendar color="gray" size={15} />, value: `Experience: ${provider?.years_of_experience ? `${provider?.years_of_experience}yrs` : 'Not set'}` },
                        { Icon: () => <FaRegUserCircle color="gray" size={15} />, value: `Gender: ${provider?.gender || 'Not set'}` },
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
                <div className="text-lg font-medium text-black mb-4">Specialties</div>

                {
                    provider?.provider_specialties?.map((s, i) => {
                        return (
                            <p
                                key={i}
                                className="capitalize text-gray-600 m-0 p-0 font-medium text-sm"
                            >
                                {s?.replaceAll("_", " ")}
                            </p>
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
                <div className="text-lg font-medium text-black mb-4">Availability</div>

                {
                    provider?.availability
                        ?
                        Object.keys(provider?.availability)?.map((d, i) => {
                            const weekday = d

                            const { closing, opening } = provider?.availability[weekday]

                            return (
                                <div
                                    key={i}
                                    className="flex flex-col items-start justify-start mb-4"
                                >
                                    <div className="rounded-lg capitalize font-medium text-white text-sm bg-[#6F3DCB] px-3 py-1 mb-2">
                                        {weekday}
                                    </div>

                                    {
                                        (opening && closing)
                                        ?
                                        <div className="flex gap-2 flex-wrap">
                                            <div
                                                className="text-gray-600 text-xs"
                                            >
                                                Opening {timeToAMPM_FromHour({ hour: opening })}
                                            </div>
                                            <div
                                                className="text-gray-600 text-xs"
                                            >
                                                Closing {timeToAMPM_FromHour({ hour: closing })}
                                            </div>
                                        </div>
                                        :
                                        <div
                                            className="text-black text-xs"
                                        >
                                            Not set
                                        </div>
                                    }
                                </div>
                            )
                        })
                        :
                        <ZeroItems
                            zeroText={"Not set"}
                        />
                }
            </div>

            <div
                style={{
                    borderBottom: '1px solid gray'
                }}
                className="w-full pb-6"
            >
                <div className="text-lg font-medium text-black mb-4">Booking Fees & duration</div>

                <div
                    className="flex items-center justify-between flex-wrap gap-3 mb-4"
                >
                    <div className="flex gap-2 flex-wrap">
                        <span className="font-semibold text-sm">
                            {provider?.currency}
                        </span>
                        <span className="font-bold text-sm">
                            {provider?.base_price}
                        </span>
                    </div>

                    <div>
                        for every
                    </div>

                    <div className="rounded-lg capitalize font-medium text-white text-sm bg-[#6F3DCB] px-3 py-1 mb-2">
                        {secondsToLabel({ seconds: provider?.base_duration })}
                    </div>
                </div>
            </div>
        </div>
    )
}