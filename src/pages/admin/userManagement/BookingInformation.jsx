import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MotherProfile from "./MotherProfile";
import { toast } from "react-toastify";
import PathHeader from "../components/PathHeader";
import ProfileImg from "../components/ProfileImg";
import { BsBookmark, BsCalendar, BsCheckCircle } from "react-icons/bs";
import { FaEllipsisH } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { LuFileWarning, LuMessageCircleWarning } from "react-icons/lu";
import { formatDate1, isoToDateTime, timeToAMPM_FromHour } from "../../../lib/utils";
import { useReactToPrint } from "react-to-print";
import PatientInfo from "../mothers/PatientInfo";

function BookingInformation() {

    const navigate = useNavigate()

    const { state } = useLocation()

    const containerRef = useRef(null)

    const downloadEntireDoc = useReactToPrint({
        contentRef: containerRef
    });      

    const bookingInfo = state?.bookingInfo
    const mother = state?.mother

    useEffect(() => {
        if (!bookingInfo || !mother) {
            toast.info("No booking/mother information found!")
            navigate('/admin/user-management')
        }
    }, [])

    if (!bookingInfo || !mother) return <></>

    const role = bookingInfo?.provider_profile ? 'Provider' : 'Vendor'
    const assignedProvider = role === 'Provider' ? bookingInfo?.provider_profile : bookingInfo?.vendor_profile

    const timelineEvents = 
        role === 'Provider' 
        ?
            [
                {
                    icon: <BsCalendar className="w-5 h-5 text-blue-500" />,
                    title: "Consultation preview",
                    description: bookingInfo?.booking_brief || "Not set",
                    type: "consultation"
                },
                {
                    icon: <BsBookmark className="w-5 h-5 text-green-500" />,
                    title: `Booking made - ${formatDate1({ dateISO: new Date(bookingInfo?.day).toISOString() })}, ${timeToAMPM_FromHour({ hour: bookingInfo?.hour })}`,
                    description: "",
                    type: "booking"
                },
                ...(
                    (bookingInfo?.status == 'ongoing' || bookingInfo?.status == 'new')
                    ? 
                        [
                            {
                                icon: <FaEllipsisH className="w-5 h-5 text-green-500" />,
                                title: "Pending",
                                description: "Available for completed sessioons",
                                type: "pending"                    
                            }
                        ] 
                    : 
                        [
                            {
                                icon: bookingInfo?.prescription_note ? <FiFileText className="w-5 h-5 text-blue-500" /> : <LuFileWarning className="w-5 h-5 text-red-500" />,
                                title: "Prescription Issued",
                                description: bookingInfo?.prescription_note || "Not set",
                                type: "prescription"
                            },
                            {
                                icon: bookingInfo?.summary_note ? <FiFileText className="w-5 h-5 text-gray-500" /> : <LuMessageCircleWarning className="w-5 h-5 text-red-500" />,
                                title: "Therapy Notes Added",
                                description: bookingInfo?.summary_note || 'Not set',
                                type: "notes"
                            },
                        ]
                ),
            ]
        :
            [
                {
                    icon: <BsBookmark className="w-5 h-5 text-green-500" />,
                    title: `Booking made - ${formatDate1({ dateISO: new Date(bookingInfo?.day).toISOString() })}, ${timeToAMPM_FromHour({ hour: bookingInfo?.start_hour })}`,
                    description: "",
                    type: "booking"
                },                
            ]

    return (
        <div className="flex min-h-screen w-full pb-5">
            {/* Main Content */}
            <div ref={containerRef} className="flex-1 w-full flex flex-col">

                {/* breadcrumbs */}
                <PathHeader
                    paths={[
                        { type: 'text', text: 'User Management' },
                        { type: 'text', text: 'Mothers' },
                        { type: 'text', text: mother?.name },
                        { type: 'text', text: `${role} booking: ${bookingInfo?.id?.slice(0, 5)}...` },
                    ]}
                />

                {/* Main grid */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Patient Info */}
                    <div className="w-full md:w-1/3 bg-white rounded-xl p-4 md:p-6">
                        <PatientInfo
                            screeningInfo={{
                                ...bookingInfo,
                                user_profile: mother
                            }}
                        />                        

                        {
                            role === 'Provider'
                            &&
                                <>
                                    <div className="mt-4">
                                        <div className="text-sm font-medium mb-2">
                                            Session Summary & Notes
                                        </div>
                                        <textarea
                                            disabled={true}
                                            className="w-full border h-[87px] rounded p-2 text-xs"
                                            rows={2}
                                            placeholder="-"
                                            defaultValue={bookingInfo?.summary_note || 'Not set'}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <div className="text-sm font-medium mb-2">
                                            Prescription note
                                        </div>
                                        <textarea
                                            disabled={true}
                                            className="w-full border h-[87px] rounded p-2 text-xs"
                                            rows={2}
                                            placeholder="-"
                                            defaultValue={bookingInfo?.prescription_note || 'Not set'}
                                        />
                                    </div>                                    
                                </>
                        }
                        <div className="mt-4">
                            <div className="text-sm font-medium mb-2">
                                Attachments & Reports
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between text-sm">
                                    <button onClick={downloadEntireDoc} className="cursor-pointer bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                        Download Consolidated PDF
                                    </button>
                                </div>
                            </div>
                        </div>                        
                    </div>

                    {/* Right: Provider, Timeline, Bookings */}
                    <div className="w-full md:w-2/3 flex flex-col gap-6">
                        {/* Assigned Provider */}
                        <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="text-sm text-gray-500 mb-3">
                                    Assigned { role }
                                </div>
                                <div
                                    className="flex items-center justify-between gap-4"
                                >
                                    <div
                                        className="flex items-center gap-2"
                                    >
                                        <ProfileImg
                                            profile_img={assignedProvider?.profile_img}
                                            size="10"
                                        />
                                        <div>
                                            <div className="font-medium">{assignedProvider?.provider_name || assignedProvider?.business_name}</div>
                                            <div className="text-xs text-gray-500">
                                                {assignedProvider?.professional_title || assignedProvider?.service_name}
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                            <button className="bg-purple-600 text-white px-3 py-1 rounded-lg cursor-pointer text-purple-600 text-xs font-medium">
                                View
                            </button>                            
                        </div>

                        {/* Status Timeline */}
                        <div className="bg-white rounded-xl p-4 md:p-6">
                            <div className="text-sm text-gray-500 mb-3">Status Timeline</div>
                            {timelineEvents.map((event, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                                            {event.icon}
                                        </div>
                                        {index < timelineEvents.length - 1 && (
                                            <div className="w-px h-12 bg-gray-200 mt-2"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 pb-8">
                                        <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                                        {event.description && (
                                            <p className="text-sm text-gray-600">{event.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingInformation;
