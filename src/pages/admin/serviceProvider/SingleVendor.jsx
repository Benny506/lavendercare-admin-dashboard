import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PathHeader from "../components/PathHeader";
import { toast } from "react-toastify";
import ProviderInfo from "../healthcareProvider/auxiliary/ProviderInfo";
import { useDispatch, useSelector } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import useApiReqs from "../../../hooks/useApiReqs";
import { getStatusBadge } from "../../../lib/utils_Jsx";
import { formatDate1, formatTo12Hour, timeToAMPM_FromHour } from "../../../lib/utils";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../components/Pagination";
import VendorInfo from "./auxiliary/VendorInfo";
import VendorServices from "./auxiliary/VendorServices";
import { getAdminState } from "../../../redux/slices/adminState";
import MothersGrid from "./auxiliary/MothersGrid";
import { getUserDetailsState } from "../../../redux/slices/userDetailsSlice";
import usePermissions from "../../../hooks/usePermissions";

function SingleVendor() {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { state } = useLocation()

    const provider = state?.provider

    const { fetchProviderBookings, fetchProviderAssignments } = useApiReqs()
    const { hasPermission } = usePermissions()

    const permissions = useSelector(state => getUserDetailsState(state).permissions)
    const permKeys = permissions.map(p => p.permission_key);

    const [bookings, setBookings] = useState(null)
    const [assignments, setAssignments] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [pageListIndex, setPageListIndex] = useState(0)

    useEffect(() => {
        if (!provider) {
            navigate(-1)
            toast.info("Could load provider profile")

            return;
        }

        fetchProviderBookings({
            callBack: ({ bookings }) => setBookings(bookings),
            provider_id: provider?.id
        })

        fetchProviderAssignments({
            callBack: ({ providerAssignments }) => {
                setAssignments(providerAssignments || [])
            },
            provider_id: provider?.id
        })
    }, [])

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

    if (!provider) return <></>

    return (
        <div className="pt-6 w-full flex">
            {/* Main Content */}
            <div className="flex-1 w-full flex flex-col">

                {/* breadcrumbs */}
                <PathHeader
                    paths={[
                        { text: 'Providers' },
                        { text: provider?.username },
                    ]}
                />

                {/* Main grid */}
                <div className="w-full">
                    <div className="mb-4">
                        <VendorInfo
                            vendor={provider}
                        />
                    </div>

                    {
                        hasPermission({ requiredPerms: ['providers.assign'] })
                        &&
                        <div className="mb-4">
                            <MothersGrid
                                mothers={assignments.map(assign => assign?.user_profile)}
                                onSelect={(mother) => {
                                    navigate("/admin/mothers/single-mother", { state: { user: mother } })
                                }}
                            />
                        </div>
                    }

                    {
                        hasPermission({ requiredPerms: ['service.delete', 'services.create', 'services.edit'] })
                        &&
                        <div className="w-full flex flex-col gap-6">
                            {/* Vendor services  */}
                            <div className="bg-white rounded-xl p-4 md:p-6">
                                <div className="text-sm text-gray-500 mb-3">All services</div>

                                <VendorServices
                                    provider={provider}
                                />
                            </div>
                            {/* Past Bookings */}
                            <div className="bg-white rounded-xl p-4 md:p-6 mb-2">
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
                                                    <th className="py-2 pr-4">Services</th>
                                                    <th className="py-2 pr-4">Date</th>
                                                    <th className="py-2 pr-4">Status</th>
                                                    <th className="py-2 pr-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pageItems.map((b, idx) => {

                                                    const date =
                                                        `${formatDate1({ dateISO: new Date(b?.day).toISOString() })}. ${formatTo12Hour({ time: b?.start_time })}`

                                                    return (
                                                        <tr key={idx} className="border-t border-gray-100">
                                                            <td className="py-2 pr-4 font-medium">{b?.service_info?.service_name}</td>
                                                            <td className="py-2 pr-4">{date}</td>
                                                            <td className="py-2 pr-4">
                                                                {getStatusBadge(b?.status)}
                                                            </td>
                                                            <td className="py-2 pr-4">
                                                                <button
                                                                    onClick={() => navigate('/admin/user-management/booking-information', { state: { bookingInfo: b, mother: b?.user_profile } })}
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

                                        <div className="mb-2" />
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default SingleVendor;
