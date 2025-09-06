import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import useApiReqs from "../../../hooks/useApiReqs";
import { getUserDetailsState } from "../../../redux/slices/userDetailsSlice";
import { formatDate1, isoToDateTime, removeDuplicatesByKey, sortByDate, timeToAMPM_FromHour } from "../../../lib/utils";
import ProfileImg from "../components/ProfileImg";
import { getStatusBadge } from "../../../lib/utils_Jsx";
import PathHeader from "../components/PathHeader";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";
import PatientInfo from "../mothers/PatientInfo";



function MotherProfile() {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { state } = useLocation()

    const user = state?.user  

    const { fetchMotherBookings } = useApiReqs()

    const profile = useSelector(state => getUserDetailsState(state).profile)

    const [p_bookings, set_p_bookings] = useState([])
    const [v_bookings, set_v_bookings] = useState([])
    const [providers, setProviders] = useState([])
    const [vendors, setVendors] = useState([])
    const [timelines, setTimelines] = useState([])
    const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
    const [currentPage, setCurrentPage] = useState(0)
    const [pageListIndex, setPageListIndex] = useState(0)      

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
        if (!user) {
            navigate('/admin/user-management')
            toast.info("Could load mother profile")
        }
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
        setTimelines([...p_bookings, ...v_bookings])
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


    const { pageItems, totalPages, pageList, totalPageListIndex } = usePagination({
        arr: timelines,
        maxShow: 4,
        index: currentPage,
        maxPage: 5,
        pageListIndex
    });  

    const incrementPageListIndex = () => {
        if(pageListIndex === totalPageListIndex){
            setPageListIndex(0)
        
        } else{
            setPageListIndex(prev => prev+1)
        }

        return
    }

    const decrementPageListIndex = () => {
        if(pageListIndex == 0){
            setPageListIndex(totalPageListIndex)
        
        } else{
            setPageListIndex(prev => prev-1)
        }

        return
    }      

    if (!user) return <></>

    return (
        <div className="flex min-h-screen w-full">
            {/* Main Content */}
            <div className="flex-1 w-full flex flex-col">

                <PathHeader 
                    paths={[
                        { type: 'text', text: 'Mothers' },
                        { type: 'text', text: user?.name },
                    ]}
                />

                {/* Main grid */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Patient Info */}
                    <div className="w-full md:w-1/3 bg-white rounded-xl p-4 md:p-6">
                        <button 
                            onClick={() => navigate('/admin/mothers/mother-messages', { state: { mother: user } })}
                            className="px-3 py-2 rounded-lg bg-purple-100 text-purple-600 font-medium text-sm cursor-pointer"
                        >
                            Send a message
                        </button>
                        <PatientInfo
                            screeningInfo={{
                                user_profile: user
                            }}
                            noMentalHealth={true}
                        />
                        <hr />
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

                                            <button 
                                                onClick={() => navigate('/admin/healthcare-provider/single-provider', { state: { user: p } })}
                                                className="bg-purple-600 text-white px-3 py-1 rounded-lg cursor-pointer text-purple-600 text-xs font-medium"
                                            >
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

                                            <button 
                                                onClick={() => navigate('/admin/service-provider/single-vendor', { state: { user: v } })}
                                                className="bg-purple-600 text-white px-3 py-1 rounded-lg cursor-pointer text-purple-600 text-xs font-medium"
                                            >
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
                            <div className="text-sm text-gray-500 mb-3">Bookings</div>
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
                                                <th className="py-2 pr-4">Who</th>
                                                <th className="py-2 pr-4">Date & Time</th>
                                                <th className="py-2 pr-4">Service / Profession</th>
                                                <th className="py-2 pr-4">Status</th>
                                                <th className="py-2 pr-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {timelines.map((b, idx) => {

                                                const date = 
                                                    `${formatDate1({ dateISO: new Date(b?.day).toISOString() })}, ${timeToAMPM_FromHour({ hour: b?.hour || b?.start_hour })}`

                                                const type = b?.provider_profile ? 'Provider consultation' : 'Vendor service booked'

                                                const service_profession = b?.provider_profile?.professional_title || b?.vendor_profile?.service_name

                                                const name = b?.provider_profile?.provider_name || b?.vendor_profile?.business_name

                                                return (
                                                    <tr key={idx} className="border-t border-gray-100">
                                                        <td className="py-2 pr-4 font-medium">{type}</td>
                                                        <td className="py-2 pr-4 font-medium">{name}</td>
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
                                                            <button
                                                                onClick={() => navigate('/admin/user-management/booking-information', { state: { bookingInfo: b, mother: user } })} 
                                                                className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg cursor-pointer"
                                                            >
                                                                View Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>

                                    <Pagination
                                        currentPage={currentPage}
                                        pageItems={pageItems}
                                        pageListIndex={pageListIndex}
                                        pageList={pageList}
                                        totalPageListIndex={totalPageListIndex}
                                        decrementPageListIndex={decrementPageListIndex}
                                        incrementPageListIndex={incrementPageListIndex}
                                        setCurrentPage={setCurrentPage}
                                    />                                    
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
