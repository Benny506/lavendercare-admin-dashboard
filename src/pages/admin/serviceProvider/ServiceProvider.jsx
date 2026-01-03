import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminState, setAdminState } from "../../../redux/slices/adminState";
import { vendorStatusColors, vendorStatuses } from "../../../lib/utils_Jsx";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";
import supabase from "../../../database/dbInit";
import ZeroItems from "../components/ZeroItems";
import ServiceInfoModal from "./auxiliary/ServiceInfoModal";
import ConfirmModal from "../components/ConfirmModal";
import { data, useNavigate } from "react-router-dom";
import PathHeader from "../components/PathHeader";
import useApiReqs from "../../../hooks/useApiReqs";
import ServiceCategoryModal from "./auxiliary/ServiceCategoryModal";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../components/Pagination";
import { statusUpdateMail } from "../../../lib/email";


function ServiceProvider() {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { fetchVendorServiceCategories, deleteVendorServiceCategory, addVendorServiceCategory, fetchServices, updateService } = useApiReqs()

  const services = useSelector(state => getAdminState(state).services)
  const vendorServiceCategories = useSelector(state => getAdminState(state).vendorServiceCategories)

  const [rejectModal, setRejectModal] = useState({ visible: false, hide: null, data: {} });
  const [activeTab, setActiveTab] = useState('all')
  const [apiReqs, setApiReqs] = useState({ isLoading: false, data: null, errorMsg: null })
  const [searchFilter, setSearchFilter] = useState('')
  const [canLoadMore, setCanLoadMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageListIndex, setPageListIndex] = useState(0)
  const [serviceCategoryModal, setServiceCategoryModal] = useState({ visible: false, hide: null })
  const [rejectServiceReason, setRejectServiceReason] = useState('')

  useEffect(() => {
    const loadedServices = (services || [])

    fetchVendorServiceCategories({})

    fetchServices({})
  }, [])

  useEffect(() => {
    const { isLoading, data } = apiReqs

    // if (isLoading) dispatch(appLoadStart());
    // else dispatch(appLoadStop())

    if (isLoading && data) {
      const { type, requestInfo } = data

      if (type === 'addVendorServiceCategory') {
        addVendorServiceCategory({
          service: requestInfo?.service
        })
      }

      if (type === 'deleteVendorServiceCategory') {
        deleteVendorServiceCategory({
          service: requestInfo?.service
        })
      }
    }
  }, [apiReqs])

  const openServiceCategoryModal = () => setServiceCategoryModal({ visible: true, hide: hideServiceCategoryModal })
  const hideServiceCategoryModal = () => setServiceCategoryModal({ visible: false, hide: null })

  const openRejectModal = (v) => setRejectModal({ visible: true, hide: hideRejectModal, data: v })
  const hideRejectModal = () => setRejectModal({ visible: false, hide: null, data: {} })

  const rejectService = (s) => {
    alterServiceStatus({ newStatus: 'rejected', service_id: s?.id })
  }
  const approveService = (s) => {
    alterServiceStatus({ newStatus: 'approved', service_id: s?.id })
  }
  const alterServiceStatus = async ({ newStatus, service_id }) => {

    const provider_id = services?.filter(s => s?.id === service_id)?.[0]?.provider?.id
    const provider_name = services?.filter(s => s?.id === service_id)?.[0]?.provider?.username
    const service_name = services?.filter(s => s?.id === service_id)?.[0]?.service_name

    updateService({
      callBack: async ({ }) => {
        await statusUpdateMail({
          receiver_id: provider_id,
          subject: `Service Status Update`,
          title: `Service ${newStatus}`,
          extra_text:
            newStatus === 'approved'
              ?
              `Your service: ${service_name} has been approved`
              :
              `Your service: ${service_name} was rejected. ${rejectServiceReason}`,
          username: provider_name,
          btn_link: "https://lavendercare-providers.netlify.app/#/services"
        })
        setRejectServiceReason('')
      },
      update: {
        status: newStatus
      },
      service_id
    })

    return
  }

  const filteredData = services?.filter(s => {

    const serviceName = s?.service_name || ''
    const username = s?.provider?.username || ''

    const matchesTab = activeTab === 'all' ? true : activeTab === s?.status

    const matchesSearch =
      (
        serviceName?.toLowerCase().includes(searchFilter?.toLowerCase())
        ||
        searchFilter?.toLowerCase().includes(serviceName?.toLowerCase())

        ||

        username?.toLowerCase().includes(searchFilter?.toLowerCase())
        ||
        searchFilter?.toLowerCase().includes(username?.toLowerCase())
      )

    return matchesTab && matchesSearch
  })

  const { pageItems, totalPages, pageList, totalPageListIndex } = usePagination({
    arr: filteredData,
    maxShow: 4,
    index: currentPage,
    maxPage: 5,
    pageListIndex
  });

  const incrementPageListIndex = () => {
    alert(totalPageListIndex)
    alert(pageListIndex)
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

  return (
    <div className="pt-6 w-full pb-5">
      {/* Breadcrumbs and title */}
      <PathHeader
        paths={[
          { text: 'Services' }
        ]}
      />

      {/* service providers */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Service Providers</h2>
          {/* <button className="bg-purple-600 text-white px-4 py-2 rounded font-semibold text-xs">
          Add Provider
        </button> */}
        </div>

        <div className="bg-white rounded-xl p-4 flex flex-col min-w-[120px] mb-4">
          <span className="text-xs text-gray-500 mb-1">All Service Categories</span>
          <span className="text-3xl font-bold">
            {vendorServiceCategories?.length || 0}
          </span>
          <div className="flex items-center justify-end w-full">
            <button
              onClick={openServiceCategoryModal}
              className="text-(--primary-500) text-sm text-right mt-2 cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-200">
        {["all", ...vendorStatuses].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-2 text-xs font-semibold border-b-2 capitalize cursor-pointer ${tab === activeTab
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-400"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Table card */}
      <div className="bg-white rounded-xl p-2 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div>
            <div className="font-semibold text-sm mb-1">All Services</div>
            <div className="text-xs text-gray-500">
              See all services below
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <input
                value={searchFilter}
                onChange={e => setSearchFilter(e?.target?.value)}
                className="w-full border rounded px-3 py-2 text-xs"
                placeholder="Search service"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <circle cx="7" cy="7" r="5.5" stroke="#BDBDBD" />
                  <path d="M11 11l3 3" stroke="#BDBDBD" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full divide-y text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Business Name
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Service Name
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Status
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Rating
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 w-max">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className=" divide-y">
              {
                pageItems?.length > 0
                  ?
                  pageItems.map((v, idx) => {
                    return (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          {v?.provider?.username}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          {v?.service_name}
                        </td>

                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${vendorStatusColors[v.status]
                              }`}
                          >
                            {v.status}
                          </span>
                        </td>

                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap flex items-center justify-center gap-1 w-max">
                          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                            <path
                              d="M8 1.333l2.06 4.175 4.607.669-3.334 3.25.787 4.586L8 11.667l-4.12 2.046.787-4.586-3.334-3.25 4.607-.669L8 1.333z"
                              fill="#FACC15"
                            />
                          </svg>
                          {v?.avg_rating}
                        </td>

                        <td className="py-2 sm:py-3 px-2 sm:px-4 w-max">
                          <div className="flex flex-col sm:flex-row w-max gap-2 items-center">
                            {v.status === "pending" && (
                              <>
                                <button onClick={() => approveService(v)} className="bg-green-600 cursor-pointer text-white px-3 py-1 rounded text-xs w-full sm:w-auto transition hover:bg-green-700">
                                  Approve
                                </button>
                                <button
                                  className="bg-red-600 cursor-pointer text-white px-3 py-1 rounded text-xs w-full sm:w-auto transition hover:bg-red-700"
                                  onClick={() => openRejectModal(v)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {(v.status === "rejected" || v.status === "approved") && (
                              <></>
                            )}

                            <button
                              onClick={() => navigate('/admin/services/single-provider/service-details', { state: { provider: v?.provider, service: v } })}
                              className="bg-purple-600 cursor-pointer text-white px-3 py-1 rounded text-xs w-full sm:w-auto transition hover:bg-purple-700"
                            >
                              Service Info
                            </button>
                            <button
                              onClick={() => navigate('/admin/services/single-provider', { state: { provider: v?.provider } })}
                              className="bg-purple-100 cursor-pointer text-purple-600 hover:bg-purple-200 px-3 py-1 rounded text-xs w-full sm:w-auto transition"
                            >
                              Business Info
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                  :
                  <tr
                    className="border-t border-gray-100"
                  >
                    <td
                      colSpan={'6'}
                      className="py-5"
                    >
                      <ZeroItems
                        zeroText={'No services found'}
                      />
                    </td>
                  </tr>
              }
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

        <div>
          {
            canLoadMore
            &&
            <div className="w-full flex items-center justify-center my-5">
              <button
                onClick={() => {
                  setApiReqs({
                    isLoading: true,
                    errorMsg: null,
                    data: {
                      type: 'fetchServices'
                    }
                  })
                }}
                className={'bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer'}
              >
                Load more
              </button>
            </div>
          }
        </div>

        {/* Pagination UI (not functional) */}
        {/* <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-xs text-gray-500 gap-2">
          <button className="px-2 py-1">&lt; Previous</button>
          <div className="flex gap-1 flex-wrap">
            <button className="w-6 h-6 rounded-full bg-purple-100 text-purple-700">
              1
            </button>
            <button className="w-6 h-6 rounded-full hover:bg-purple-100">
              2
            </button>
            <span>3</span>
            <span>...</span>
            <span>8</span>
            <span>9</span>
            <button className="w-6 h-6 rounded-full hover:bg-purple-100">
              10
            </button>
          </div>
          <button className="px-2 py-1">Next &gt;</button>
        </div> */}
      </div>

      {/* Reject Modal  */}
      <ConfirmModal
        modalProps={{
          ...rejectModal,
          data: {
            ...rejectModal?.data,
            title: 'Reject business',
            msg: 'Are you sure you want to reject this business',
            yesFunc: rejectService,
            noFunc: () => { },
          }
        }}
      >
        <p className="mb-2 text-sm text-gray-500">Reason for rejecting this service {'('}optional{')'}</p>
        <div className="relative">
          <textarea
            value={rejectServiceReason}
            onChange={e => setRejectServiceReason(e.target.value)}
            placeholder="Because of this or that"
            className="w-full rounded-xl bg-white px-4 py-3 text-gray-900 shadow-sm border border-gray-200 transition-all duration-200 focus:outline-none focus:border-[#703dcb] focus:ring-4 focus:ring-[#703dcb]/15 hover:shadow-md"
          />
        </div>
      </ConfirmModal>

      <ServiceCategoryModal
        modalProps={serviceCategoryModal}
        setApiReqs={setApiReqs}
      />
    </div>
  );
}

export default ServiceProvider;
