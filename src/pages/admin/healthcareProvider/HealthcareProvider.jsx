import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminState, setAdminState } from "../../../redux/slices/adminState";
import { IoToggle } from "react-icons/io5";
import { MdToggleOff, MdToggleOn } from "react-icons/md";
import ZeroItems from "../components/ZeroItems";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";
import supabase from "../../../database/dbInit";
import PathHeader from "../components/PathHeader";
import Pagination from "../components/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { useNavigate } from "react-router-dom";
import { getStatusBadge, providerStatusColors } from "../../../lib/utils_Jsx";
import useApiReqs from "../../../hooks/useApiReqs";


function HealthcareProvider() {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { loadMoreUsers } = useApiReqs()

  const providers = useSelector(state => getAdminState(state).providers)

  const [searchFilter, setSearchFilter] = useState('')
  const [apiReqs, setApiReqs] = useState({ isLoading: false, data: null, errorMsg: null })
  const [currentPage, setCurrentPage] = useState(0)
  const [pageListIndex, setPageListIndex] = useState(0)
  const [statsData, setStatsData] = useState({
    totalProviders: 0, activeProviders: 0, inActiveProviders: 0
  })
  const [canLoadMore, setCanLoadMore] = useState(true)

  useEffect(() => {
    setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'initialFetch'
      }
    })
  }, [])

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if (isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop());

    if (isLoading && data) {
      const { type } = data

      if (type === 'initialFetch') {
        initialFetch()
      }

      if (type === 'loadMoreUsers') {
        loadMoreUsers({
          callBack: ({ canLoadMore }) => setCanLoadMore(canLoadMore)
        })
      }
    }
  }, [apiReqs])

  const initialFetch = async () => {
    try {

      const { count: totalProviders, error: totalProvidersError } = await supabase
        .from('provider_profiles')
        .select('*', { count: 'exact', head: true });

      const { count: activeProviders, error: activeProvidersError } = await supabase
        .from('provider_profiles')
        .select('*', { count: 'exact', head: true })
        .eq("credentials_approved", true);

      const { count: inActiveProviders, error: inActiveProvidersError } = await supabase
        .from('provider_profiles')
        .select('*', { count: 'exact', head: true })
        .eq("credentials_approved", false)

      if (totalProvidersError || activeProvidersError || inActiveProvidersError) {
        console.log("totalProvidersError", totalProvidersError)
        console.log("activeProvidersError", activeProvidersError)
        console.log("inActiveProvidersError", inActiveProvidersError)

        throw new Error()
      }

      setStatsData({
        totalProviders, activeProviders, inActiveProviders
      })

      setApiReqs({ isLoading: false, errorMsg: null, data: null })

      return;

    } catch (error) {
      console.log(error)
      return initialFetchFailure({ errorMsg: 'Something went wrong! Try again.' })
    }
  }
  const initialFetchFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return
  }

  const filteredData = (providers || []).filter(p => {
    const { provider_name, professional_title } = p

    const matchesSearch =
      (
        searchFilter?.toLowerCase().includes(provider_name?.toLowerCase())
        ||
        provider_name?.toLowerCase().includes(searchFilter?.toLowerCase())

        ||
        searchFilter?.toLowerCase().includes(professional_title?.toLowerCase())
        ||
        professional_title?.toLowerCase().includes(searchFilter?.toLowerCase())
      );

    return matchesSearch;
  })

  const totalProvidersCount = statsData.totalProviders
  const activeProvidersCount = statsData.activeProviders
  const inActiveProvidersCount = statsData.inActiveProviders

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

  return (
    <div className=" pt-6 min-h-screen">
      {/* Breadcrumbs and title */}
      <PathHeader
        paths={[
          { text: 'Health Providers' }
        ]}
      />

      {/* healthcare provider title */}
      <div className="flex justify-between py-4 items-center">
        <h2 className="text-xl sm:text-2xl font-bold">
          Healthcare Provider
        </h2>

        <div className="text-xs w-max text-gray-500 flex gap-2 bg-white py-3 px-4 rounded-sm items-center">
          <svg
            width="18"
            height="14"
            viewBox="0 0 18 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 10.6919L9 5.1534M9 5.1534L11.4615 7.61493M9 5.1534L6.53846 7.61493M4.69231 13.1534C2.6531 13.1534 1 11.5003 1 9.46109C1 7.82585 2.06302 6.43889 3.53571 5.95355C3.48701 5.69428 3.46154 5.42681 3.46154 5.1534C3.46154 2.77432 5.39016 0.845703 7.76923 0.845703C9.76409 0.845703 11.4422 2.20168 11.9322 4.04221C12.1716 3.96458 12.4271 3.92263 12.6923 3.92263C14.0518 3.92263 15.1538 5.02469 15.1538 6.38416C15.1538 6.66982 15.1052 6.94411 15.0157 7.1992C16.1757 7.63992 17 8.76193 17 10.0765C17 11.7758 15.6224 13.1534 13.9231 13.1534H4.69231Z"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Export
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 flex flex-col items-start min-w-[120px]">
          <span className="text-xs text-gray-500 mb-1">Total Providers</span>
          <span className="text-3xl font-bold">
            {totalProvidersCount}
          </span>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col items-start min-w-[120px]">
          <span className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_922_25372)">
                <path
                  d="M19.6665 5.5V19.5H5.6665V5.5H19.6665ZM19.6665 3.5H5.6665C4.5565 3.5 3.6665 4.4 3.6665 5.5V19.5C3.6665 20.6 4.5565 21.5 5.6665 21.5H19.6665C20.7665 21.5 21.6665 20.6 21.6665 19.5V5.5C21.6665 4.4 20.7665 3.5 19.6665 3.5ZM12.6665 12.5C11.0165 12.5 9.6665 11.15 9.6665 9.5C9.6665 7.85 11.0165 6.5 12.6665 6.5C14.3165 6.5 15.6665 7.85 15.6665 9.5C15.6665 11.15 14.3165 12.5 12.6665 12.5ZM12.6665 8.5C12.1165 8.5 11.6665 8.95 11.6665 9.5C11.6665 10.05 12.1165 10.5 12.6665 10.5C13.2165 10.5 13.6665 10.05 13.6665 9.5C13.6665 8.95 13.2165 8.5 12.6665 8.5ZM18.6665 18.5H6.6665V16.97C6.6665 14.47 10.6365 13.39 12.6665 13.39C14.6965 13.39 18.6665 14.47 18.6665 16.97V18.5ZM8.9765 16.5H16.3565C15.6665 15.94 13.9765 15.38 12.6665 15.38C11.3565 15.38 9.6565 15.94 8.9765 16.5Z"
                  fill="#669F2A"
                />
              </g>
              <defs>
                <clipPath id="clip0_922_25372">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0.666504 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
            Active
          </span>
          <span className="text-3xl font-bold">
            {activeProvidersCount}
          </span>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col items-start min-w-[120px]">
          <span className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_922_25382)">
                <path
                  d="M19.3335 5.5V19.5H5.3335V5.5H19.3335ZM19.3335 3.5H5.3335C4.2235 3.5 3.3335 4.4 3.3335 5.5V19.5C3.3335 20.6 4.2235 21.5 5.3335 21.5H19.3335C20.4335 21.5 21.3335 20.6 21.3335 19.5V5.5C21.3335 4.4 20.4335 3.5 19.3335 3.5ZM12.3335 12.5C10.6835 12.5 9.3335 11.15 9.3335 9.5C9.3335 7.85 10.6835 6.5 12.3335 6.5C13.9835 6.5 15.3335 7.85 15.3335 9.5C15.3335 11.15 13.9835 12.5 12.3335 12.5ZM12.3335 8.5C11.7835 8.5 11.3335 8.95 11.3335 9.5C11.3335 10.05 11.7835 10.5 12.3335 10.5C12.8835 10.5 13.3335 10.05 13.3335 9.5C13.3335 8.95 12.8835 8.5 12.3335 8.5ZM18.3335 18.5H6.3335V16.97C6.3335 14.47 10.3035 13.39 12.3335 13.39C14.3635 13.39 18.3335 14.47 18.3335 16.97V18.5ZM8.6435 16.5H16.0235C15.3335 15.94 13.6435 15.38 12.3335 15.38C11.0235 15.38 9.3235 15.94 8.6435 16.5Z"
                  fill="#8B8B8A"
                />
              </g>
              <defs>
                <clipPath id="clip0_922_25382">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0.333496 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
            Inactive
          </span>
          <span className="text-3xl font-bold">
            {inActiveProvidersCount}
          </span>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl p-2 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div>
            <div className="font-semibold text-sm mb-1">
              All Healthcare Provider
            </div>
            <div className="text-xs text-gray-500">
              See all your Providers below
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <input
                value={searchFilter}
                onChange={e => setSearchFilter(e?.target?.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs"
                placeholder="Search"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <circle cx="7" cy="7" r="5.5" stroke="#BDBDBD" />
                  <path d="M11 11l3 3" stroke="#BDBDBD" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            {/* <button className="border-gray-300 bg-white border px-2 sm:px-3 py-2 rounded text-xs">
              Filter by: All
            </button> */}
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Name
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Years of Exprience
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Professional Title
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Rating
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

                    return (
                      <tr
                        key={idx}
                        onClick={() => navigate('/admin/healthcare-provider/single-provider', { state: { user: p } })}
                        className="hover:bg-gray-100 cursor-pointer border-t border-gray-100"
                      >
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          {p?.provider_name}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          {p?.years_of_experience || 'Not set'}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          {p?.professional_title || 'Not set'}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap flex items-center gap-1">
                          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                            <path
                              d="M8 1.333l2.06 4.175 4.607.669-3.334 3.25.787 4.586L8 11.667l-4.12 2.046.787-4.586-3.334-3.25 4.607-.669L8 1.333z"
                              fill="#FACC15"
                            />
                          </svg>
                          {p.avg_rating}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          <label className={`inline-flex items-center ${providerStatusColors[p?.status]}`}>
                            {
                              // p?.credentials_approved
                              //   ?
                              //   <MdToggleOn
                              //     size={50}
                              //     className={"text-purple-600"}
                              //   />
                              //   :
                              //   <MdToggleOff
                              //     size={50}
                              //     className={'text-gray-200'}
                              //   />
                              p?.status
                            }
                          </label>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap flex gap-2">
                          {/* <button className="text-purple-600 hover:underline"> */}
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14.0514 3.73889L15.4576 2.33265C16.0678 1.72245 17.0572 1.72245 17.6674 2.33265C18.2775 2.94284 18.2775 3.93216 17.6674 4.54235L8.81849 13.3912C8.37792 13.8318 7.83453 14.1556 7.23741 14.3335L5 15L5.66648 12.7626C5.84435 12.1655 6.1682 11.6221 6.60877 11.1815L14.0514 3.73889ZM14.0514 3.73889L16.25 5.93749M15 11.6667V15.625C15 16.6605 14.1605 17.5 13.125 17.5H4.375C3.33947 17.5 2.5 16.6605 2.5 15.625V6.87499C2.5 5.83946 3.33947 4.99999 4.375 4.99999H8.33333"
                              stroke="#6F3DCB"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          {/* </button> */}
                        </td>
                      </tr>
                    )
                  })
                  :
                  <tr className="border-t border-gray-100">
                    <td colSpan={'6'} className="pt-5">
                      <ZeroItems zeroText={'No provider found'} />
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
                                type: 'loadMoreUsers'
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
    </div>
  );
}

export default HealthcareProvider;
