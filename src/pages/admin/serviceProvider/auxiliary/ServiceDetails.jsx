import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { formatNumberWithCommas, getHourFromHHMM, secondsToLabel, timeToAMPM_FromHour } from "../../../../lib/utils";
import { getServiceStatusColor, getServiceStatusFeedBack } from "../../../../lib/utils_Jsx";
import PathHeader from "../../components/PathHeader";
import Badge from "../../components/ui/Badge";
import { BsChevronLeft, BsPlus, BsStack, BsTrash, BsType } from "react-icons/bs";
import { GoDash } from "react-icons/go";
import ZeroItems from "../../components/ZeroItems";
import { FaEdit } from "react-icons/fa";
import useApiReqs from "../../../../hooks/useApiReqs";
import ServiceType from "./ServiceType";
import AddServiceModal from "./AddServiceModal";
import ServiceHours from "./ServiceHours";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function ServiceDetails() {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const { state } = useLocation()

    const { updateServiceType, deleteServiceType, insertServiceType, updateService, fetchSingleService } = useApiReqs()

    const service_id = state?.service?.id
    const provider = state?.provider

    const [serviceTypeModal, setServiceTypeModal] = useState({ visible: false, hide: null })
    const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
    const [service, setService] = useState(null)
    const [editServiceModal, setEditServiceModal] = useState({ step: null })
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
        if (!service_id || !provider) {
            // goBack()
            console.log(service_id, provider)
            return;

        } else {
            fetchSingleService({
                callBack: ({ service }) => {
                    if (service) {
                        setService(service)

                    } else {
                        goBack()
                    }
                },
                service_id
            })
        }
    }, [])

    const goBack = () => {
        navigate(-1)
        toast.info("Provider & Service information could not be retrieved")
    }

    const openServiceTypeModal = ({ info }) => setServiceTypeModal({ visible: true, hide: hideServiceTypeModal, info })
    const hideServiceTypeModal = () => setServiceTypeModal({ visible: false, hide: null })

    if (!service || !provider) return <></>

    const { id, service_name, availability, currency, base_price, base_duration,
        status, service_category, service_details, location, country, city
    } = service

    return (
        <div className="pt-6 w-full flex">
            {/* Main Content */}
            <div className="flex-1 w-full flex flex-col">

                {/* breadcrumbs */}
                <PathHeader
                    paths={[
                        { text: 'Vendors' },
                        { text: provider?.username },
                        { text: service?.service_name },
                    ]}
                />

                <div className="flex flex-col bg-white p-4 rounded-2xl gap-2">
                    <h2 className="text-xl font-bold text-grey-700"> {service_name} </h2>
                    <div className="flex gap-2">
                        <Badge variant="default"> {service_category?.replaceAll("_", " ")} </Badge>
                    </div>
                </div>

                <div
                    className={`flex justify-between gap-4 my-6 w-full p-4 rounded-2xl ${getServiceStatusColor({ status })}`}
                >
                    <div className="flex flex-col justify-between">
                        <p className="text-md font-bold">
                            {status}
                        </p>
                        <p className="text-sm">
                            {getServiceStatusFeedBack({ status })}
                        </p>
                    </div>

                    {
                        service?.status === 'hidden'
                            ?
                            <Button
                                onClick={() => updateService({
                                    callBack: ({ updatedService }) => {
                                        if (updatedService) {
                                            setService(updatedService)
                                        }
                                    },
                                    update: {
                                        status: "approved"
                                    },
                                    service_id: service?.id
                                })}
                            >
                                Show
                            </Button>
                            :
                            service?.status === 'approved'
                            &&
                            <Button
                                onClick={() => updateService({
                                    callBack: ({ updatedService }) => {
                                        if (updatedService) {
                                            setService(updatedService)
                                        }
                                    },
                                    update: {
                                        status: "hidden"
                                    },
                                    service_id: service?.id
                                })}
                                variant="danger"
                            >
                                Hide
                            </Button>
                    }
                </div>

                <div className="mb-6">
                    <ServiceHours
                        info={service?.availability}
                        handleContinueBtnClick={availability => {
                            updateService({
                                callBack: ({ updatedService }) => {
                                    if (updatedService) {
                                        setService(updatedService)
                                    }

                                    setEditServiceModal({ step: null })
                                },
                                update: {
                                    availability
                                },
                                service_id: service?.id,
                            })
                        }}
                    />
                </div>

                <div className="mb-6">
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Service Types</h2>
                            <Button
                                variant="ghost"
                                onClick={() => openServiceTypeModal({ info: null })}
                                className="text-[#703dcb]"
                            >
                                <BsPlus className="text-2xl" />
                                Add
                            </Button>
                        </div>

                        {service?.types?.length ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {service?.types?.map((t) => (
                                    <div
                                        key={t.id}
                                        className="shadow rounded-xl p-4 transition"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-lg">{t.type_name}</h3>
                                            <Badge variant="outline">
                                                {t.is_virtual ? "Virtual" : "Physical"}
                                            </Badge>
                                        </div>

                                        <div className="text-sm space-y-1 text-gray-700">
                                            <p>Duration: {secondsToLabel({ seconds: t.duration })}</p>
                                            <p>
                                                Price: {t.currency}{" "}
                                                {formatNumberWithCommas(t.price)}
                                            </p>
                                        </div>

                                        <div className="flex justify-between mt-4">
                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    openServiceTypeModal({ info: t })
                                                }
                                                className="text-[#703dcb]"
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                className="text-red-500"
                                                onClick={() =>
                                                    deleteServiceType({
                                                        callBack: ({ deleted_type_id }) => {
                                                            if (!deleted_type_id) return

                                                            const updatedService = {
                                                                ...service,
                                                                types: (service?.types || [])?.filter(t => t?.id !== deleted_type_id)
                                                            }

                                                            setService(updatedService)
                                                        },
                                                        type_id: t?.id,
                                                        service_id: service?.id
                                                    })
                                                }
                                            >
                                                <BsTrash size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <ZeroItems
                                zeroText="No session types"
                            />
                        )}
                    </section>
                </div>

                {/* Details Section */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 space-y-6">

                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Service Details</h2>
                        <Button
                            variant="ghost"
                            onClick={() => setEditServiceModal({ step: 'add' })}
                            className="text-primary-600 font-semibold"
                        >
                            Edit
                        </Button>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {/* Description */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <h3 className="font-semibold text-gray-800">Description</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">{service_details}</p>
                        </div>

                        {/* Location Info */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <h3 className="font-semibold text-gray-800">Location</h3>
                            <ul className="text-gray-700 text-sm space-y-1">
                                <li><span className="font-medium">Country:</span> {country?.replaceAll("_", " ")}</li>
                                <li><span className="font-medium">State:</span> {service?.state?.replaceAll("_", " ")}</li>
                                <li><span className="font-medium">City:</span> {city?.replaceAll("_", " ")}</li>
                                <li><span className="font-medium">Specific Location:</span> {location}</li>
                            </ul>
                        </div>

                    </div>
                </section>

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

            <ServiceType
                info={serviceTypeModal?.info}
                isOpen={serviceTypeModal?.visible}
                hide={serviceTypeModal?.hide}
                handleContinueBtnClick={({ requestInfo, info }) => {
                    if (info?.id) {
                        return updateServiceType({
                            callBack: ({ updatedServiceType }) => {
                                if (!updatedServiceType) return;

                                const updatedService = {
                                    ...(service || {}),
                                    types: (service?.types || [])?.map(t => {
                                        if (t?.id === updatedServiceType?.id) {
                                            return updatedServiceType
                                        }

                                        return t
                                    })
                                }

                                setService(updatedService)
                                hideServiceTypeModal()
                            },
                            type_id: info?.id,
                            update: requestInfo
                        })
                    }

                    insertServiceType({
                        callBack: ({ newServiceType }) => {
                            if (!newServiceType) return;

                            const updatedService = {
                                ...(service || {}),
                                types: [newServiceType, ...(service?.types || [])]
                            }

                            setService(updatedService)
                            hideServiceTypeModal()
                        },
                        requestInfo: {
                            ...requestInfo,
                            service_id: service?.id
                        }
                    })
                }}
            />

            <AddServiceModal
                info={service || {}}
                isOpen={editServiceModal.step == 'add'}
                hide={() => setEditServiceModal({ step: null })}
                goBackBtnFunc={() => setEditServiceModal({ step: null })}
                continueBtnFunc={(update) => {
                    updateService({
                        callBack: ({ updatedService }) => {
                            if (updatedService) {
                                setService(updatedService)
                            }

                            setEditServiceModal({ step: null })
                        },
                        update,
                        service_id: service?.id,
                    })
                }}
                setApiReqs={setApiReqs}
            />
        </div>
    );
}