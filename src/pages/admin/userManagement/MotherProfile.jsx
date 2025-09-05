import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PatientInfo from "../healthcareProvider/auxiliary/PatientInfo";
import { useDispatch, useSelector } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import useApiReqs from "../../../hooks/useApiReqs";
import { getUserDetailsState } from "../../../redux/slices/userDetailsSlice";
import { isoToDateTime, removeDuplicatesByKey, sortByDate } from "../../../lib/utils";
import ProfileImg from "../components/ProfileImg";
import { getStatusBadge } from "../../../lib/utils_Jsx";

// Mock data
const patient = {
    name: "Chinenye Okeke",
    role: "Mother",
    status: "Active",
    age: 29,
    postpartum: 21,
    contact: "email@example.com",
    phone: "0801 234 5678",
    pregnancyStatus: "Postpartum",
};

const assignedProvider = {
    name: "Dr. Evelyn Reed",
    role: "Doctor",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
};

const timelineData = [
    {
        type: "Consultation",
        date: "07/15/2025, 2:00 PM",
        note: "Patient is experiencing mild anxiety...",
    },
    {
        type: "Booking made",
        date: "07/17/2025, 2:00 PM",
    },
    {
        type: "Screening Completed",
        date: "07/09/2025",
    },
    {
        type: "Prescription issued",
        date: "",
        note: "Sertraline, Dosage: 50mg",
    },
    {
        type: "Therapy Notes Added",
        date: "07/10/2024",
    },
    {
        type: "Consultation",
        date: "07/01/2024, 10:00 AM",
        note: "Initial assessment and treatment plan...",
    },
];

const bookingsData = [
    {
        service: "Medical Consultation",
        date: "Jul 15, 2025",
        time: "10:00 AM",
        status: "Accepted",
    },
    {
        service: "Therapy Session",
        date: "Jul 10, 2025",
        time: "2:00 PM",
        status: "Accepted",
    },
    {
        service: "Psychiatric Evaluation",
        date: "Jul 5, 2025",
        time: "11:30 AM",
        status: "Completed",
    },
    {
        service: "Medical Consultation",
        date: "Jun 28, 2025",
        time: "9:00 AM",
        status: "Completed",
    },
    {
        service: "Therapy Session",
        date: "Jun 20, 2025",
        time: "4:00 PM",
        status: "Declined",
    },
];

function MotherProfile({ user }) {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { fetchMotherBookings } = useApiReqs()

    const profile = useSelector(state => getUserDetailsState(state).profile)

    const [p_bookings, set_p_bookings] = useState([])
    const [v_bookings, set_v_bookings] = useState([])
    const [providers, setProviders] = useState([])
    const [vendors, setVendors] = useState([])
    const [timelines, setTimelines] = useState([])
    const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })

    useEffect(() => {
        setApiReqs({
            isLoading: true,
            errorMsg: null,
            data: {
                type: 'initialFetch',
            }
        })
    }, [])

    useEffect(() => {
        const { isLoading, data } = apiReqs

        if (isLoading) dispatch(appLoadStart());
        else dispatch(appLoadStop());

        if (isLoading && data) {
            const { type, requestInfo } = data

            if (type === 'initialFetch') {
                initialFetch()
            }
        }
    }, [apiReqs])

    useEffect(() => {
        const _providers = removeDuplicatesByKey({
            arr: p_bookings.map(p_b => p_b?.provider_profile),
            key: 'provider_id'
        })
        setProviders(_providers)
    }, [p_bookings])

    useEffect(() => {
        const _vendors = removeDuplicatesByKey({
            arr: v_bookings.map(v_b => v_b?.vendor_profile),
            key: 'id'
        })
        setVendors(_vendors)
    }, [v_bookings])

    useEffect(() => {
        const allBookings = sortByDate({
            arr: [...p_bookings, ...v_bookings],
            key: 'created_at'
        })

        setTimelines(allBookings)
    }, [p_bookings, v_bookings])

    const initialFetch = async () => {
        try {

            await fetchMotherBookings({
                callBack: ({ bookings, v_bookings }) => {
                    set_p_bookings(bookings)
                    set_v_bookings(v_bookings)
                },
                mother_id: user?.id
            })

            setApiReqs({ isLoadin: false, data: null, errorMsg: null })

        } catch (error) {
            console.log(error)
        }
    }

    if (!user) return <></>

    return (
        <div className="flex min-h-screen w-full">
            {/* Main Content */}
            <div className="flex-1 w-full flex flex-col">

                {/* breadcrumbs */}
                <div className="flex py-[24px] items-center gap-1">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6.66667 14.1663H13.3333M9.18141 2.30297L3.52949 6.6989C3.15168 6.99276 2.96278 7.13968 2.82669 7.32368C2.70614 7.48667 2.61633 7.67029 2.56169 7.86551C2.5 8.0859 2.5 8.32521 2.5 8.80384V14.833C2.5 15.7664 2.5 16.2331 2.68166 16.5896C2.84144 16.9032 3.09641 17.1582 3.41002 17.318C3.76654 17.4996 4.23325 17.4996 5.16667 17.4996H14.8333C15.7668 17.4996 16.2335 17.4996 16.59 17.318C16.9036 17.1582 17.1586 16.9032 17.3183 16.5896C17.5 16.2331 17.5 15.7664 17.5 14.833V8.80384C17.5 8.32521 17.5 8.0859 17.4383 7.86551C17.3837 7.67029 17.2939 7.48667 17.1733 7.32368C17.0372 7.13968 16.8483 6.99276 16.4705 6.69891L10.8186 2.30297C10.5258 2.07526 10.3794 1.9614 10.2178 1.91763C10.0752 1.87902 9.92484 1.87902 9.78221 1.91763C9.62057 1.9614 9.47418 2.07526 9.18141 2.30297Z"
                            stroke="#8B8B8A"
                            stroke-width="1.66667"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>

                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g clip-path="url(#clip0_1918_35894)">
                            <path
                                d="M6.66656 4L5.72656 4.94L8.7799 8L5.72656 11.06L6.66656 12L10.6666 8L6.66656 4Z"
                                fill="#8B8B8A"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_1918_35894">
                                <rect width="16" height="16" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    <p className="text-[12px]">Service providers</p>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g clip-path="url(#clip0_1918_35894)">
                            <path
                                d="M6.66656 4L5.72656 4.94L8.7799 8L5.72656 11.06L6.66656 12L10.6666 8L6.66656 4Z"
                                fill="#8B8B8A"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_1918_35894">
                                <rect width="16" height="16" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    <p className="text-(--primary-500) font-[600] text-[12px]">
                        View all
                    </p>
                </div>

                {/* Main grid */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Patient Info */}
                    <div className="w-full md:w-1/3 bg-white rounded-xl p-4 md:p-6">
                        <div className="mt-4 space-y-2">
                            <PatientInfo
                                screeningInfo={{
                                    user_profile: user
                                }}
                                noMentalHealth={true}
                            />
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button className="bg-red-100 text-red-700 px-4 py-2 rounded">
                                Suspend
                            </button>
                            <button className="bg-red-600 text-white px-4 py-2 rounded">
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Right: Provider, Timeline, Bookings */}
                    <div className="w-full md:w-2/3 flex flex-col gap-6">
                        {/* Providers booked in the pase */}
                        <div className="bg-white rounded-xl p-4 md:p-6">
                            <div>
                                <div className="text-sm text-gray-500 mb-3">
                                    Providers booked in the past
                                </div>
                                {providers?.length > 0 ?
                                    providers.map((p, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between gap-4"
                                        >
                                            <div
                                                className="flex items-center gap-2"
                                            >
                                                <ProfileImg
                                                    profile_img={p?.profile_img}
                                                    size="10"
                                                />
                                                <div>
                                                    <div className="font-medium">{p?.provider_name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {p?.professional_title}
                                                    </div>
                                                </div>
                                            </div>

                                            <button className="bg-purple-600 text-white px-3 py-1 rounded-lg cursor-pointer text-purple-600 text-xs font-medium">
                                                View
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="text-xs text-gray-400">-</div>
                                    )}
                            </div>
                        </div>

                        {/* Vendors booked in the pase */}
                        <div className="bg-white rounded-xl p-4 md:p-6">
                            <div>
                                <div className="text-sm text-gray-500 mb-3">
                                    Vendors booked in the past
                                </div>
                                {vendors?.length > 0 ?
                                    vendors.map((v, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between gap-4"
                                        >
                                            <div
                                                className="flex items-center gap-2"
                                            >
                                                <ProfileImg
                                                    profile_img={v?.profile_img}
                                                    size="10"
                                                />
                                                <div>
                                                    <div className="font-medium">{v?.provider_name}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {v?.location || 'Not set'}
                                                    </div>
                                                </div>
                                            </div>

                                            <button className="bg-purple-600 text-white px-3 py-1 rounded-lg cursor-pointer text-purple-600 text-xs font-medium">
                                                View
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="text-xs text-gray-400">-</div>
                                    )}
                            </div>
                        </div>

                        {/* Past Bookings */}
                        <div className="bg-white rounded-xl p-4 md:p-6">
                            <div className="text-sm text-gray-500 mb-3">Past Bookings</div>
                            {timelines.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                                        <rect width="48" height="48" rx="12" fill="#F3F3F3" />
                                        <path
                                            d="M24 14V24L30 28"
                                            stroke="#BDBDBD"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <rect
                                            x="12"
                                            y="12"
                                            width="24"
                                            height="24"
                                            rx="6"
                                            stroke="#BDBDBD"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                    <div className="text-gray-400 mt-2 font-medium">
                                        No data to display
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Recent appointments will appear here
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-xs md:text-sm">
                                        <thead>
                                            <tr className="text-left text-gray-400">
                                                <th className="py-2 pr-4">Type</th>
                                                <th className="py-2 pr-4">Date & Time</th>
                                                <th className="py-2 pr-4">Service / Profession</th>
                                                <th className="py-2 pr-4">Status</th>
                                                <th className="py-2 pr-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {timelines.map((b, idx) => {

                                                const date = isoToDateTime({ isoString: b?.created_at })

                                                const type = b?.provider_profile ? 'Provider consultation' : 'Vendor service booked'

                                                const service_profession = b?.provider_profile?.professional_title || b?.vendor_profile?.service_name

                                                return (
                                                    <tr key={idx} className="border-t border-gray-100">
                                                        <td className="py-2 pr-4 font-medium">{type}</td>
                                                        <td className="py-2 pr-4">{date}</td>
                                                        <td className="py-2 pr-4">{service_profession}</td>
                                                        <td className="py-2 pr-4">
                                                            { getStatusBadge(b?.status) }
                                                            {/* <span
                                                                className={`px-2 py-1 rounded text-xs font-semibold ${b.status === "Accepted"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : b.status === "Completed"
                                                                        ? "bg-blue-100 text-blue-700"
                                                                        : "bg-red-100 text-red-700"
                                                                    }`}
                                                            >
                                                                {b.status}
                                                            </span> */}
                                                        </td>
                                                        <td className="py-2 pr-4">
                                                            <button className="bg-purple-100 text-purple-700 px-3 py-1 rounded">
                                                                View Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MotherProfile;
