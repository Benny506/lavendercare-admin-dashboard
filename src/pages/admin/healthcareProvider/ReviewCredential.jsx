import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminState, setAdminState } from "../../../redux/slices/adminState";
import ZeroItems from "../components/ZeroItems";
import { isoToDateTime } from "../../../lib/utils";
import Modal from "../components/ui/Modal";
import ProfileImg from "../components/ProfileImg";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import supabase from "../../../database/dbInit";
import { toast } from "react-toastify";
import { providerStatusColors } from "../../../lib/utils_Jsx";
import PathHeader from "../components/PathHeader";
import { getPublicImageUrl } from "../../../lib/requestApi";
import LicenseBadge from "./auxiliary/LicenseBadge";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../components/Pagination";
import { sendEmail, statusUpdateMail } from "../../../lib/email";

function ReviewCredential() {
  const dispatch = useDispatch()

  const providers = useSelector(state => getAdminState(state).providers)

  const [currentPage, setCurrentPage] = useState(0)
  const [pageListIndex, setPageListIndex] = useState(0)
  const [showModal, setShowModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchFilter, setSearchFilter] = useState('')
  const [apiReqs, setApiReqs] = useState({ isLoading: false, data: null, errorMsg: null })

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if (isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop());

    if (isLoading && data) {
      const { type, requestInfo } = data

      if (type === 'updateStatus') {
        updateStatus({ requestInfo })
      }
    }
  }, [apiReqs])

  const updateStatus = async ({ requestInfo }) => {
    try {

      const { provider_id, status } = requestInfo

      const { data, error } = await supabase
        .from('providers_licenses')
        .update({ status })
        .eq("provider_id", provider_id)
        .select()
        .single()

      if (error) {
        console.log(error)
        throw new Error()
      }

      await statusUpdateMail({
        to_email: 'olomufeh@gmail.com',
        subject: 'License status update',
        title: `License ${status}`,
        provider_name: selectedProvider?.username,
        extra_text:
          status === 'approved'
            ?
            `Your submitted license document(s) have been approved. You are eligible to create healthcare services. Although, every service you create will still be reviewed before it is made publicly available to all mothers on LavenderCare`
            :
            `Your submitted license document(s) have been rejected and thus deleted. Kindly re-visit your dashboard and resubmit if you intend to offer Health-Care services.`
      })

      const updatedProviders = (providers || []).map(p => {
        if (p?.id === provider_id) {
          return {
            ...p,
            license: data
          }
        }

        return p
      })

      dispatch(setAdminState({ providers: updatedProviders }))

      setShowModal(false)

      setApiReqs({ isLoading: false, errorMsg: null, data: null })

      toast.success("Updated status")

    } catch (error) {
      console.log(error)
      return updateStatusFailure({ errorMsg: 'Something went wrong! Try again.' })
    }
  }
  const updateStatusFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return;
  }

  const handleReview = (provider) => {
    setSelectedProvider(provider);
    setShowModal(true);
  };

  const filteredData = (providers || [])?.filter(p => {
    const { username } = p

    const matchSearchFilter = (
      searchFilter?.toLowerCase().includes(username?.toLowerCase())
      ||
      username?.toLowerCase().includes(searchFilter?.toLowerCase())
    )

    return matchSearchFilter
  })

  const { pageItems, totalPages, pageList, totalPageListIndex } = usePagination({
    arr: filteredData,
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

  const rejectCredentials = () => {
    if (!selectedProvider) return;

    if (!selectedProvider?.credentials_approved && selectedProvider?.status === 'rejected') {
      toast.success("Credentials already rejected")
      return;
    }

    initiateStatusUpdate({ provider_id: selectedProvider?.id, status: 'rejected' })
  }
  const acceptCredentials = () => {
    if (!selectedProvider) return;

    // if (selectedProvider?.license?.status === 'approved') {
    //   toast.success("Credentials already approved")
    //   return;
    // }

    initiateStatusUpdate({ provider_id: selectedProvider?.id, status: 'approved' })
  }
  const initiateStatusUpdate = ({ provider_id, status }) => {
    return setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'updateStatus',
        requestInfo: {
          provider_id,
          status
        }
      }
    })
  }

  return (
    <div className="pt-6 w-full">
      {/* breadcrumbs*/}
      <PathHeader
        paths={[
          { text: 'Health providers' },
          { text: 'Review credentials' },
        ]}
      />

      {/* review credentials */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Review Credentials</h2>
        {/* <button className="bg-gray-100 px-4 py-2 rounded font-semibold text-xs flex items-center gap-2">
          Individual Providers
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path
              d="M4 6l4 4 4-4"
              stroke="#8B8B8A"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button> */}
      </div>

      {/*  */}
      <div className="bg-white rounded-xl p-2 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div>
            <div className="font-semibold text-base">
              All Healthcare Provider credentials
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <input
                value={searchFilter}
                onChange={e => setSearchFilter(e?.target?.value)}
                className="w-full border rounded px-3 py-2 text-xs"
                placeholder="Search"
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

        {/* review credentials table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Profile
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Provider Name
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Submitted On
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Status
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {
                pageItems?.length > 0
                  ?
                  pageItems.map((p, idx) => {

                    const profile_img = p?.profile_img ? getPublicImageUrl({ path: p?.profile_img, bucket_name: 'user_profiles' }) : null

                    return (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          <ProfileImg
                            profile_img={profile_img}
                            name={p?.username}
                          />
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          {p?.username}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          {p?.documents_submitted_on ? isoToDateTime({ isoString: p?.documents_submitted_on }) : 'Not submitted'}
                        </td>
                        <td className={`py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap flex
                      `}>
                          <LicenseBadge license={p?.license} />
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          {
                            !p?.license
                              ?
                              'No action'
                              :
                              <button
                                className="bg-purple-600 cursor-pointer text-white px-4 py-1 rounded-full text-xs w-full sm:w-auto transition hover:bg-purple-700"
                                onClick={() => handleReview(p)}
                              >
                                Review
                              </button>
                          }
                        </td>
                      </tr>
                    )
                  })
                  :
                  <tr className="border-t border-gray-100">
                    <td colSpan={'6'} className="mt-5 p-5">
                      <ZeroItems
                        zeroText={'No providers found!'}
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

          <div className="pb-2" />
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && selectedProvider && (
        <Modal
          isOpen={showModal && selectedProvider}
          onClose={() => setShowModal(false)}
        >
          {/* poup when clicked on review button */}
          <div className="p-3">
            <button
              className="absolute cursor-pointer left-4 top-4 text-purple-600 font-semibold flex items-center gap-1"
              onClick={() => setShowModal(false)}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path
                  d="M12 16l-4-4 4-4"
                  stroke="#8B8B8A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>

            <div className="flex flex-col items-center mt-8 mb-4">
              <div className="bg-purple-100 rounded-full p-4 mb-2">
                <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                  <rect width="32" height="32" rx="16" fill="#E9D5FF" />
                  <path
                    d="M10 22V10h12v12H10zm2-2h8V12h-8v8zm2-4h4v2h-4v-2z"
                    fill="#8B5CF6"
                  />
                </svg>
              </div>
              <ProfileImg
                name={selectedProvider?.username}
                profile_img={selectedProvider?.profile_img ? getPublicImageUrl({ path: selectedProvider?.profile_img, bucket_name: 'user_profiles' }) : null}
                size="16"
              />
              <div className="font-semibold text-lg">
                {selectedProvider?.username}
              </div>

              <input
                type="checkbox"
                className="w-5 h-5 accent-purple-600 rounded"
                checked={selectedProvider?.license?.status === 'approved' ? true : false}
                readOnly
              />
            </div>

            <div className="mb-4">
              <div className="font-semibold text-sm mb-1">Info</div>
              <div className="text-xs text-gray-500">
                Email: {selectedProvider?.email}
              </div>
              {/* <div className="text-xs text-gray-500">
                Phone Number: { selectedProvider?.phone_number }
              </div> */}
            </div>

            <div className="mb-4">
              <div className="font-semibold text-sm mb-2">
                Credential Documents
              </div>

              <div className="space-y-3">
                {Array.isArray(selectedProvider?.license?.documents) &&
                  selectedProvider.license.documents.length > 0 ? (

                  selectedProvider.license.documents.map((doc, index) => {

                    const url = doc?.file ? getPublicImageUrl({ path: doc?.file, bucket_name: 'provider_licenses' }) : null

                    return (
                      <div
                        key={index}
                        className="border rounded-xl p-3 flex items-center justify-between bg-white hover:bg-purple-50/40 transition"
                      >
                        <div className="flex items-start gap-3">
                          {/* File Icon */}
                          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                              <path
                                d="M6 2h5l5 5v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                                fill="#8B5CF6"
                              />
                            </svg>
                          </div>

                          {/* Info */}
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              Credential {index + 1}
                            </p>

                            <p className="text-xs text-gray-400">
                              {doc?.extraText}
                            </p>
                          </div>
                        </div>

                        {/* Action */}
                        <button
                          className="text-sm text-purple-600 font-medium underline hover:text-purple-700"
                          onClick={() => {
                            if (!url) {
                              toast.info("Invalid credential document");
                              return;
                            }

                            window.open(url, "_blank");
                          }}
                        >
                          View
                        </button>
                      </div>
                    )
                  })

                ) : (
                  <div className="text-xs text-gray-400 italic">
                    No credential documents uploaded.
                  </div>
                )}
              </div>
            </div>


            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <div className="w-full sm:w-1/2">
                <button onClick={rejectCredentials} className="cursor-pointer bg-red-600 text-white px-6 py-2 rounded-full font-semibold w-full">
                  Reject
                </button>

                <p className="text-xs text-center pt-1 text-gray-400">
                  This will delete the credentials submitted and inform the provider
                </p>
              </div>
              <div className="w-full sm:w-1/2">
                <button onClick={acceptCredentials} className="cursor-pointer bg-purple-600 text-white px-6 py-2 rounded-full font-semibold w-full">
                  Accept
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ReviewCredential;
