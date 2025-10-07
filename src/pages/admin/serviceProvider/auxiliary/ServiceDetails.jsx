import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { formatNumberWithCommas, getHourFromHHMM, secondsToLabel, timeToAMPM_FromHour } from "../../../../lib/utils";
import { getServiceStatusColor, getServiceStatusFeedBack } from "../../../../lib/utils_Jsx";
import PathHeader from "../../components/PathHeader";
import Badge from "../../components/ui/Badge";
import { BsChevronLeft } from "react-icons/bs";
import { GoDash } from "react-icons/go";

export default function ServiceDetails() {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { state } = useLocation()

    const service = state?.service
    const vendor = state?.vendor

    const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
    const [days, setDays] = useState({
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    })

    useEffect(() => {
        if (!service || !vendor) {
            navigate('/admin/service-provider/single-vendor')
            toast.info("Vendor & Service information could not be retrieved")
        }
    }, [])

    if (!service || !vendor) return <></>

    const { id, service_name, availability, currency, base_price, base_duration,
        status, service_category, service_details, location, country, city
    } = service

    return (
        <div className="flex min-h-screen w-full">
            {/* Main Content */}
            <div className="flex-1 w-full flex flex-col">

                {/* breadcrumbs */}
                <PathHeader
                    paths={[
                        { text: 'Vendors' },
                        { text: vendor?.business_name },
                        { text: service?.service_name },
                    ]}
                />

                <div className="flex flex-col bg-white p-4 rounded-2xl gap-2">
                    <h2 className="text-xl font-bold text-grey-700"> {service_name} </h2>
                    <div className="flex gap-2">
                        <Badge variant="neutral"> {service_category?.replaceAll("_", " ")} </Badge>
                    </div>
                </div>

                <div
                    className={`flex gap-4 my-6 w-full p-4 rounded-2xl ${getServiceStatusColor({ status })}`}
                >
                    <div className="flex flex-col justify-between">
                        <p className="text-md font-bold">
                            {status}
                        </p>
                        <p className="text-sm">
                            {getServiceStatusFeedBack({ status })}
                        </p>
                    </div>
                </div>

                {/* Availability Section */}
                <div className="bg-white rounded-lg p-4 shadow mb-6">
                    <h3 className="text-xl font-bold text-grey-700 mb-3">Availability</h3>

                    <div className='space-y-4 flex flex-col items-start justify-start w-full font-semibold text-sm'>
                        {Object.keys(days).map((day, index) => {

                            if (!availability[day]) {
                                return;
                            }

                            const { closing, opening } = availability[day]

                            return (
                                <div
                                    key={day}
                                    className="flex flex-col items-start justify-start"
                                >
                                    <div className={`bg-purple-600 px-3 py-1 rounded-lg rounded-lg mb-3`}>
                                        <p className="text-sm font-bold text-white capitalize">{day}</p>
                                    </div>

                                    <div
                                        className="flex items-center"
                                    >
                                        {
                                            opening && closing
                                                ?
                                                <>
                                                    <span className="text-gray-600 font-medium text-sm">
                                                        {timeToAMPM_FromHour({ hour: opening })}
                                                    </span>
                                                    <GoDash color="gray" size={20} />
                                                    <span className="text-gray-600 font-medium text-sm">
                                                        {timeToAMPM_FromHour({ hour: closing })}
                                                    </span>
                                                </>
                                                :
                                                <span>
                                                    Not set
                                                </span>
                                        }
                                    </div>
                                </div>
                            )
                        }
                        )}
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="bg-white rounded-lg p-4 shadow mb-6">
                    <h3 className="text-xl font-bold text-grey-700 mb-3">Pricing</h3>

                    <div className="flex item-ceter justify-between bg-grey-100 rounded-2xl p-4">
                        <div className="flex flex-wrap items-center gap-5">
                            <span>Base price: <strong> {formatNumberWithCommas(base_price)} </strong></span>
                            <div>|</div>
                            <span>Base duration: <strong> {secondsToLabel({ seconds: base_duration })} </strong></span>
                            <div>|</div>                            
                            <span>Currency: <strong> {currency} </strong></span>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-white rounded-lg p-4 shadow mb-6">
                    <div className="flex justify-between mb-2 items-center">
                        <h3 className="text-xl font-bold text-grey-700 mb-3">Details</h3>
                    </div>

                    <ul className="list-disc list-inside text-gray-600 flex flex-col gap-2 item-ceter justify-between bg-grey-100 rounded-2xl p-4">
                        <li>
                            {service_details}
                        </li>
                        <li>
                            Country: {country}
                        </li>   
                        <li>
                            State: {service?.state}
                        </li> 
                        <li>
                            City: {city}
                        </li>                                                                    
                        <li>
                            Location: {location}
                        </li>
                    </ul>
                </div>

                {/* Customer Reviews */}
                {/* <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-center mb-3 gap-2">
                <h3 className="text-xl font-bold text-grey-700">Customer Review</h3>
                <span className="font-normal">(12 Reviews)</span>
                </div>

                <div className="text-gray-600 flex flex-col md:flex-row gap-4 md:gap-2 item-ceter justify-between bg-grey-100 rounded-2xl p-4 my-2">

                <div className="flex gap-2 items-center">
                    <Select defaultValue="5">
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by: 5 stars" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all" disabled>Sort by: 5 stars</SelectItem>
                        <SelectItem value="5">⭐ 5</SelectItem>
                        <SelectItem value="4">⭐ 4</SelectItem>
                        <SelectItem value="3">⭐ 3</SelectItem>
                        <SelectItem value="2">⭐ 2</SelectItem>
                        <SelectItem value="1">⭐ 1</SelectItem>
                    </SelectContent>
                    </Select>
                    <p className="">12 Reviews</p>
                </div>

                <div className="flex items-center gap-2 text-yellow-500">
                    <span className="text-xl font-extrabold text-black">4.5/5</span>
                    <Icon icon="mdi:star" className="text-xl" />
                    <Icon icon="mdi:star" className="text-xl" />
                    <Icon icon="mdi:star" className="text-xl" />
                    <Icon icon="mdi:star" className="text-xl" />
                    <Icon icon="mdi:star-half-full" className="text-xl" />
                </div>

                </div>
                
                {Array(4).fill(0).map((_, i, arr) => (
                <div
                    key={i}
                    className={`py-3 space-y-2 pb-5 ${i !== arr.length - 1 ? "border-b" : ""}`}
                >
                    <p className="text-sm text-gray-500">12/12/2024</p>
                    <h4 className="font-semibold">Hope O.</h4>
                    <div className="flex text-yellow-500 mb-1 gap-2">
                    {Array(4).fill(0).map((_, index) => (
                        <Icon key={index} icon="mdi:star" className="text-lg" />
                    ))}
                    <Icon icon="mdi:star-outline" className="text-lg" />
                    </div>
                    <p className="text-sm text-gray-500">
                    Size: <span className="font-medium">L</span> | Colour: <span className="font-medium">BLUE</span>
                    </p>
                    <p className="text-gray-600 text-sm">
                    This is a review of the product. This review will have a character limit. The date I propose This review will have a character limit.
                    </p>
                </div>
                ))}

                <div className="relative flex items-center w-full mb-3">
                <div className="flex-grow h-[1px] bg-gray-300"></div>
                <Button
                    variant="link"
                    className="mx-2 text-gray-600 font-bold text-md bg-[#fdfcff] px-3 cursor-pointer"
                >
                    See more Reviews
                </Button>
                <div className="flex-grow h-[1px] bg-gray-300"></div>
                </div>

            </div> */}
            </div>
        </div>
    );
}