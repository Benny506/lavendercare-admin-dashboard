import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PathHeader from "../components/PathHeader";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import useApiReqs from "../../../hooks/useApiReqs";
import { getStatusBadge } from "../../../lib/utils_Jsx";
import { formatDate1, timeToAMPM_FromHour } from "../../../lib/utils";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../components/Pagination";
import ProviderInfo from "./auxiliary/ProviderInfo";
import BookingInformation from "../userManagement/BookingInformation";

function SingleHealthCareProvider() {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { state } = useLocation()

    const user = state?.user

    const { fetchProviderBookings } = useApiReqs()

    const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
    const [bookings, setBookings] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [pageListIndex, setPageListIndex] = useState(0)

    useEffect(() => {
        if (!user) {
            navigate('/admin/user-management')
            toast.info("Could load provider profile")

        } else {
            if (!bookings) {
                setApiReqs({
                    isLoading: true,
                    errorMsg: null,
                    data: {
                        type: 'fetchBookings',
                        requestInfo: {
                            provider_id: user?.provider_id
                        }
                    }
                })
            }
        }
    }, [])

    useEffect(() => {
        const { isLoading, data } = apiReqs

        if (isLoading) dispatch(appLoadStart());
        else dispatch(appLoadStop());

        if (isLoading && data) {
            const { type, requestInfo } = data

            if (type === 'fetchBookings') {
                fetchBookings({ requestInfo })
            }
        }
    }, [apiReqs])

    const fetchBookings = async ({ requestInfo }) => {
        try {

            const { provider_id } = requestInfo

            await fetchProviderBookings({
                callBack: ({ bookings }) => {
                    setBookings(bookings)
                },
                provider_id
            })

        } catch (error) {
            console.log(error)
            toast.error("Something went wrong! Try again")

        } finally {
            setApiReqs({ isLoading: false, errorMsg: null, data: null })
        }
    }

    const { pageItems, totalPages, pageList, totalPageListIndex } = usePagination({
        arr: (bookings || []),
        maxShow: 4,
        index: currentPage,
        maxPage: 5,
        pageListIndex
    });

    const incrementPageListIndex = () => {
        if (pageListIndex === totalPageListIndex) {
            setPageListIndex(0)

        } else {
            setPageListIndex(prev => prev + 1)
        }

        return
    }

    const decrementPageListIndex = () => {
        if (pageListIndex == 0) {
            setPageListIndex(totalPageListIndex)

        } else {
            setPageListIndex(prev => prev - 1)
        }

        return
    }

    if (!user) return <></>

    return (
        <div className="flex min-h-screen w-full">
            {/* Main Content */}
            <div className="flex-1 w-full flex flex-col">

                {/* breadcrumbs */}
                <PathHeader
                    paths={[
                        { text: 'Healthcare Providers' },
                        { text: user?.provider_name },
                    ]}
                />

                {/* Main grid */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Patient Info */}
                    <div className="w-full md:w-1/3 bg-white rounded-xl p-4 md:p-6">
                        <ProviderInfo
                            provider={user}
                        />

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
                        {/* Past Bookings */}
                        <div className="bg-white rounded-xl p-4 md:p-6">
                            <div className="text-sm text-gray-500 mb-3">Past Bookings</div>
                            {pageItems.length === 0 ? (
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
                                                <th className="py-2 pr-4">Mother</th>
                                                <th className="py-2 pr-4">Services</th>
                                                <th className="py-2 pr-4">Date</th>
                                                <th className="py-2 pr-4">Status</th>
                                                <th className="py-2 pr-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pageItems.map((b, idx) => {

                                                const date =
                                                    `${formatDate1({ dateISO: new Date(b?.day).toISOString() })}, ${timeToAMPM_FromHour({ hour: b?.hour })}`

                                                return (
                                                    <tr key={idx} className="border-t border-gray-100">
                                                        <td className="py-2 pr-4 font-medium">{b?.user_profile?.name}</td>
                                                        <td className="py-2 pr-4 font-medium">{b?.service_type?.replaceAll("_", " ")}</td>
                                                        <td className="py-2 pr-4">{date}</td>
                                                        <td className="py-2 pr-4">
                                                            {getStatusBadge(b?.status)}
                                                        </td>
                                                        <td className="py-2 pr-4">
                                                            <button 
                                                                onClick={() => navigate('/admin/user-management/booking-information', { state: { bookingInfo: { ...b, provider_profile: user }, mother: b?.user_profile } })}
                                                                className="bg-purple-100 rounded-lg cursor-pointer text-purple-700 px-3 py-1 rounded"
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

export default SingleHealthCareProvider;
