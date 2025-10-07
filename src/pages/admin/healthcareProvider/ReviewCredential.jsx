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

function ReviewCredential() {
  const dispatch = useDispatch()

  const providers = useSelector(state => getAdminState(state).providers)

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

      const { isApproved, provider_id, status } = requestInfo

      const { data, error } = await supabase
        .from('provider_profiles')
        .update({ credentials_approved: isApproved, status })
        .eq("provider_id", provider_id)
        .select()
        .single()

      if (error) {
        console.log(error)
        throw new Error()
      }

      const updatedProviders = (providers || []).map(p => {
        if (p?.provider_id === provider_id) {
          return {
            ...p,
            credentials_approved: isApproved,
            status
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
    const { provider_name, professional_title } = p

    const matchSearchFilter = (
      searchFilter?.toLowerCase().includes(provider_name?.toLowerCase())
      ||
      provider_name?.toLowerCase().includes(searchFilter?.toLowerCase())

      ||
      searchFilter?.toLowerCase().includes(professional_title?.toLowerCase())
      ||
      professional_title?.toLowerCase().includes(searchFilter?.toLowerCase())
    )

    return matchSearchFilter
  })

  const rejectCredentials = () => {
    if (!selectedProvider) return;

    if (!selectedProvider?.credentials_approved && selectedProvider?.status === 'rejected') {
      toast.success("Credentials already rejected")
      return;
    }

    initiateStatusUpdate({ provider_id: selectedProvider?.provider_id, isApproved: false, status: 'rejected' })
  }
  const acceptCredentials = () => {
    if (!selectedProvider) return;

    if (selectedProvider?.credentials_approved && selectedProvider?.status === 'approved') {
      toast.success("Credentials already approved")
      return;
    }

    initiateStatusUpdate({ provider_id: selectedProvider?.provider_id, isApproved: true, status: 'approved' })
  }
  const initiateStatusUpdate = ({ provider_id, isApproved, status }) => {
    return setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'updateStatus',
        requestInfo: {
          isApproved,
          provider_id,
          status
        }
      }
    })
  }

  return (
    <div className="pt-6 min-h-screen">
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
                  Provider Name
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Professional Title
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
                filteredData?.length > 0
                  ?
                  filteredData.map((p, idx) => (
                    <tr key={p.name} className="border-t border-gray-100">
                      <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                        {p?.provider_name}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                        {p?.professional_title}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                        {p?.documents_submitted_on ? isoToDateTime({ isoString: p?.documents_submitted_on }) : 'Not submitted'}
                      </td>
                      <td className={`py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap flex
                      `}>
                        <div className={`${providerStatusColors[p?.status]} px-3 py-1 rounded-lg`}>
                          {p?.status}
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                        <button
                          className="bg-purple-600 cursor-pointer text-white px-4 py-1 rounded-full text-xs w-full sm:w-auto transition hover:bg-purple-700"
                          onClick={() => handleReview(p)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
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
                name={selectedProvider?.provider_name}
                profile_img={selectedProvider?.profile_img}
                size="16"
              />
              <div className="font-semibold text-lg">
                {selectedProvider?.provider_name}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {selectedProvider?.professional_title}
              </div>
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
                Credential Document
              </div>
              <div className="space-y-3">
                <div
                  className="border rounded-xl p-3 flex items-center gap-3 justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-purple-600 font-semibold text-xs">
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <rect width="20" height="20" rx="6" fill="#E9D5FF" />
                        <path
                          d="M7 15V5h6v10H7zm1-1h4V6H8v8zm1-4h2v2h-2v-2z"
                          fill="#8B5CF6"
                        />
                      </svg>
                      License document
                    </div>
                    {/* <div className="text-xs text-gray-400">200 KB</div> */}
                    <div
                      className="text-sm mt-2 text-purple-600 underline cursor-pointer"
                      onClick={() => {
                        if(!selectedProvider?.license_document){
                          toast.info("Invalid credentials")
                          return;
                        }

                        const pdfUrl = selectedProvider?.license_document
                        const fileName = 'license_document.pdf';

                        const link = document.createElement('a');
                        link.href = pdfUrl;
                        link.download = fileName; // optional — suggests a name
                        link.target = '_blank';   // open in new tab if not downloadable
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      View
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-purple-600 rounded"
                    checked={selectedProvider?.credentials_approved ? true : false}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <button onClick={rejectCredentials} className="cursor-pointer bg-red-600 text-white px-6 py-2 rounded-full font-semibold w-full sm:w-1/2">
                Reject
              </button>
              <button onClick={acceptCredentials} className="cursor-pointer bg-purple-600 text-white px-6 py-2 rounded-full font-semibold w-full sm:w-1/2">
                Accept
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ReviewCredential;
