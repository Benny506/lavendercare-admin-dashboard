import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";
import supabase from "../../../database/dbInit";
import { getAdminState, setAdminState } from "../../../redux/slices/adminState";
import { getMaxByKey, isoToDateTime } from "../../../lib/utils";
import { getRiskLevelBadge, RISK_LEVEL_STYLES } from "../../../lib/utils_Jsx";
import ZeroItems from "../components/ZeroItems";
import { Select } from "../components/ui/Select";
import TestInfoModal from "./auxiliary/TestInfoModal";
import useApiReqs from "../../../hooks/useApiReqs";


function MentalHealthScreening() {
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const { fetchTestResults } = useApiReqs()

  const mentalHealthScreenings = useSelector(state => getAdminState(state).mentalHealthScreenings)

  const [screenings, setScreenings] = useState([])
  const [apiReqs, setApiReqs] = useState({ isLoading: false, data: null, errorMsg: null })
  const [riskFilter, setRiskFilter] = useState('all')
  const [searchFilter, setSearchFilter] = useState('')
  const [testInfoModal, setTestInfoModal] = useState({ visible: false, hide: null, data: null })

  useEffect(() => {
    const loadedScreenings = (mentalHealthScreenings || [])
    
    if(loadedScreenings?.length > 0){
      setScreenings(loadedScreenings)
    
    } else{
      fetchTestResults({ 
        callBack: ({ results }) => {
          setScreenings(results)
        }
      })
    }
  }, [mentalHealthScreenings])

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if(isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop());

    if(isLoading && data){
      const { type, requestInfo } = data
    }
  }, [apiReqs])

  const openTestInfoModal = (args) => setTestInfoModal({ visible: true, hide: hideTestInfoModal, data: args })
  const hideTestInfoModal = () => setTestInfoModal({ visible: true, hide: null, data: null })

  const filteredData = screenings?.filter(s => {
    const motherName = s?.user_profile?.name

    const matchesSearch = (
      searchFilter.toLowerCase().includes(motherName?.toLowerCase())
      ||
      motherName?.toLowerCase().includes(searchFilter?.toLowerCase())
    )

    const matchesSelect = riskFilter === 'all' || !riskFilter ? true : s?.risk_level === riskFilter

    return matchesSearch && matchesSelect
  })

  return (
    <div className="pt-6 min-h-screen">
      {/* Breadcrumbs and title */}
      <div className="flex items-center gap-1">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.66667 14.1663H13.3333M9.18141 2.30297L3.52949 6.6989C3.15168 6.99276 2.96278 7.13968 2.82669 7.32368C2.70614 7.48667 2.61633 7.67029 2.56169 7.86551C2.5 8.0859 2.5 8.32521 2.5 8.80384V14.833C2.5 15.7664 2.5 16.2331 2.68166 16.5896C2.84144 16.9032 3.09641 17.1582 3.41002 17.318C3.76654 17.4996 4.23325 17.4996 5.16667 17.4996H14.8333C15.7668 17.4996 16.2335 17.4996 16.59 17.318C16.9036 17.1582 17.1586 16.9032 17.3183 16.5896C17.5 16.2331 17.5 15.7664 17.5 14.833V8.80384C17.5 8.32521 17.5 8.0859 17.4383 7.86551C17.3837 7.67029 17.2939 7.48667 17.1733 7.32368C17.0372 7.13968 16.8483 6.99276 16.4705 6.69891L10.8186 2.30297C10.5258 2.07526 10.3794 1.9614 10.2178 1.91763C10.0752 1.87902 9.92484 1.87902 9.78221 1.91763C9.62057 1.9614 9.47418 2.07526 9.18141 2.30297Z"
            stroke="#8B8B8A"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_1918_35894)">
            <path
              d="M6.66656 4L5.72656 4.94L8.7799 8L5.72656 11.06L6.66656 12L10.6666 8L6.66656 4Z"
              fill="#8B8B8A"
            />
          </g>
          <defs>
            <clipPath id="clip0_1918_35894">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <p className="text-[12px]">Health providers</p>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_1918_35894)">
            <path
              d="M6.66656 4L5.72656 4.94L8.7799 8L5.72656 11.06L6.66656 12L10.6666 8L6.66656 4Z"
              fill="#8B8B8A"
            />
          </g>
          <defs>
            <clipPath id="clip0_1918_35894">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <p className="text-(--primary-500) font-[600] text-[12px]">Mental health screening</p>
      </div>

      {/* title */}
      <div className="flex flex-col sm:flex-row sm:items-center py-4 sm:justify-between gap-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          Mental Health Screening
        </h2>
        {/* <div className="flex items-center gap-2">
          <div className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="10" fill="#F87171" />
              <path
                d="M10 6v4"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="10" cy="14" r="1" fill="#fff" />
            </svg>
            3 High-Risk Screening Submissions
          </div>
          <span className="text-xs text-gray-400 hidden sm:inline">
            Click to view high-risk screenings
          </span>
        </div> */}
      </div>
      {/* Table card */}
      <div className="bg-white rounded-xl p-2 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div>
            <div className="font-semibold text-sm mb-1">
              All Healthcare Provider
            </div>
            <div className="text-xs text-gray-500">
              See all your Provider below
            </div>
          </div>
          <div className="flex gap-2 items-center w-full sm:w-auto">
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
            <div>
              <Select
                options={['all', ...Object.keys(RISK_LEVEL_STYLES)].map(riskLevel => {
                  return {
                    value: riskLevel, 
                    label: riskLevel
                  }
                })}
                value={riskFilter}
                onChange={setRiskFilter}
                placeholder="Filter by risk level"
                searchable={true}          
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Submission date
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Mother's Name
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Score
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Interpretation
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Risk Level
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Max Risk % (Answer)
                </th>                
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {
                filteredData?.length > 0
                ?
                  filteredData.map((s, idx) => {

                    const { answer } = s
                    
                    const max_risk_percent = getMaxByKey({ arr: answer?.filter(ans => ans.alert_level == 'high' || ans?.alert_level == 'severe'), key: 'risk_level' })

                    return(
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          { s?.created_at ? isoToDateTime({ isoString: s?.created_at }) : 'Not set'}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          {s?.user_profile?.name}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          {s.score}
                        </td>
                        <td
                          className={`py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap font-semibold ${s.interpColor}`}
                        >
                          {s.remark}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          {getRiskLevelBadge(s?.risk_level)}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          { max_risk_percent?.risk_percent }%
                        </td>                        
                        <td className="py-2 gap-2 flex items-cener sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          <button
                            className="bg-purple-600 cursor-pointer text-white px-4 py-1 rounded-full text-xs w-full sm:w-auto transition hover:bg-purple-700"
                            onClick={() =>
                              navigate(`/admin/mental-health-screening/${s?.id}`, { state: { patient_id: s?.user_profile?.id } })
                            }
                          >
                            View Details
                          </button>
                          
                          <button
                            className="bg-gray-600 cursor-pointer text-white px-4 py-1 rounded-full text-xs w-full sm:w-auto transition hover:bg-grey-700"
                            onClick={() => openTestInfoModal(s)}
                          >
                            Test info
                          </button>                          
                        </td>
                      </tr>
                  )})
                :
                  <tr className="border-t border-gray-100">
                    <td colSpan={'6'} className="pt-5">
                      <ZeroItems zeroText={'No screening data found'} />
                    </td>
                  </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <TestInfoModal 
        onClose={testInfoModal?.hide}
        show={testInfoModal?.visible}
        data={testInfoModal?.data}
      />
    </div>
  );
}

export default MentalHealthScreening;
