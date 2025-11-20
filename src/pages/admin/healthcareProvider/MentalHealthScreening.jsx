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
import PathHeader from "../components/PathHeader";
import { BsCheck } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import FeedBackModal from "./auxiliary/FeedBackModal";


function MentalHealthScreening() {
  const dispatch = useDispatch()

  const navigate = useNavigate();

  const { fetchTestResults } = useApiReqs()

  const mentalHealthScreenings = useSelector(state => getAdminState(state).mentalHealthScreenings)

  const [feedBackForModal, setFeedBackForModal] = useState({ visible: false, hide: null, data: null })
  const [screenings, setScreenings] = useState([])
  const [riskFilter, setRiskFilter] = useState('all')
  const [searchFilter, setSearchFilter] = useState('')
  const [testInfoModal, setTestInfoModal] = useState({ visible: false, hide: null, data: null })
  const [canLoadMore, setCanLoadMore] = useState(true)

  useEffect(() => {
    fetchTestResults({
      callBack: ({ canLoadMore }) => {
        setCanLoadMore(canLoadMore)
      }
    })
  }, [])

  useEffect(() => {
    setScreenings(mentalHealthScreenings)

    // const loadedScreenings = (mentalHealthScreenings || [])

    // if(loadedScreenings?.length > 0){
    //   setScreenings(loadedScreenings)

    // } else{
    //   fetchTestResults({ 
    //     callBack: ({ canLoadMore }) => {
    //       setCanLoadMore(canLoadMore)
    //     }
    //   })
    // }
  }, [mentalHealthScreenings])

  const openTestInfoModal = (args) => setTestInfoModal({ visible: true, hide: hideTestInfoModal, data: args })
  const hideTestInfoModal = () => setTestInfoModal({ visible: true, hide: null, data: null })

  const openFeedBackForModal = (f_for) => setFeedBackForModal({ visible: true, hide: hideFeedBackForModal, data: f_for })
  const hideFeedBackForModal = () => setFeedBackForModal({ visible: false, hide: null, data: null })

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
      <PathHeader
        paths={[
          { text: 'Health Providers' },
          { text: 'Mental Health Screening' },
        ]}
      />

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
            <div className="font-semibold text-base">
              All mental health screening results
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
                  Feedback sent
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

                    const feedBackSent = s?.test_feedback?.length > 0

                    return (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          {s?.created_at ? isoToDateTime({ isoString: s?.created_at }) : 'Not set'}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          {s?.user_profile?.name}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          {s.score}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap text-center">
                          {feedBackSent ? <BsCheck size={16} color="#703DCB" /> : <MdOutlineCancel size={16} color="red" />}
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
                          {max_risk_percent?.risk_percent}%
                        </td>
                        <td className="py-2 gap-2 flex items-cener sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                          <button
                            className="bg-purple-600 cursor-pointer text-white px-4 py-1 rounded-full text-xs w-full sm:w-auto transition hover:bg-purple-700"
                            onClick={() =>
                              navigate(`/admin/mothers/mother-messages?mother_id=${s?.user_profile?.id}`, { state: { mother_id: s?.user_profile?.id } })
                            }
                          >
                            Chat
                          </button>
                          {
                            !feedBackSent
                            &&
                            <button
                              className="cursor-pointer text-black px-4 py-1 rounded-full text-xs w-full sm:w-auto transition"
                              onClick={() => openFeedBackForModal(s)}
                              style={{
                                border: '1px solid #703dcb'
                              }}
                            >
                              Send feedback
                            </button>
                          }

                          <button
                            className="bg-purple-600 cursor-pointer text-white px-4 py-1 rounded-full text-xs w-full sm:w-auto transition hover:bg-purple-700"
                            onClick={() =>
                              navigate(`/admin/healthcare-provider/mental-health-screening/${s?.id}`, { state: { patient_id: s?.user_profile?.id } })
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
                    )
                  })
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

      <FeedBackModal
        modalProps={feedBackForModal}
      />
    </div>
  );
}

export default MentalHealthScreening;
