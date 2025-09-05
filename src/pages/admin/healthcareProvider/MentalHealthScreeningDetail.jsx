import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getAdminState } from "../../../redux/slices/adminState";
import useApiReqs from "../../../hooks/useApiReqs";
import { getMaxByKey, isoToDateTime } from "../../../lib/utils";
import { getRiskLevelBadge } from "../../../lib/utils_Jsx";
import TestInfoModal from "./auxiliary/TestInfoModal";
import PatientInfo from "../mothers/PatientInfo";
import PathHeader from "../components/PathHeader";
// import { useParams, useNavigate } from "react-router-dom";


function MentalHealthScreeningDetail() {

  const navigate = useNavigate()

  const { state } = useLocation()
  const patient_id = state?.patient_id

  const { fetchTestResults } = useApiReqs()  

  const screenings = useSelector(state => getAdminState(state).mentalHealthScreenings)

  const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
  const [latestScreeningInfo, setLatestScreeningInfo] = useState() 
  const [patientScreeningHistory, setPatientScreeningHistory] = useState()
  const [testInfoModal, setTestInfoModal] = useState({ show: false, hide: null, data: null })  

  useEffect(() => {
      if(!patient_id){
          navigate('/admin/mental-health-screening')
      
      } else {

          if(screenings?.length > 0){
            const patientScreenings = (screenings || []).filter(s => s.user_id == patient_id)

            // const patientScreenings = sortByTimeStamp({ arr: patientScreenings, key: 'created_at' })

            const latestScreeningInfo = patientScreenings[0]

            const p_screeningHistory = patientScreenings

            if(!latestScreeningInfo){
                const errorMsg = "Error fetching patient information"
                setApiReqs({ isLoading: false, errorMsg, data: null })
            
            } else{
                setPatientScreeningHistory(p_screeningHistory)
                setLatestScreeningInfo(latestScreeningInfo)
            }            
          
          } else{
            fetchTestResults({})
          }
      }
  }, [screenings])
  
  const openTestInfoModal = (args) => setTestInfoModal({ visible: true, hide: hideTestInfoModal, data: args })
  const hideTestInfoModal = () => setTestInfoModal({ visible: true, hide: null, data: null })  

  return (
    <div className="pt-6 min-h-screen">
      <PathHeader 
        paths={[
          { text: 'Health Providers' },
          { text: 'Mental Health Screening' },
          { text: `Screening: ${latestScreeningInfo?.id?.slice(0, 5)}...` },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Patient Info */}
        <PatientInfo 
          screeningInfo={latestScreeningInfo}
        />

        {/* Right: Results */}
        <div className="flex-1 bg-white rounded-xl p-4">
          <div className="mb-6">
            <div className="font-semibold text-base mb-2">Latest Result Summary</div>
            <div className="overflow-x-auto">
              <table className="min-w-[300px] w-full text-xs">
                <tbody>
                  <tr>
                    <td className="py-2 pr-4 text-gray-500 font-medium text-sm">Score</td>
                    <td className="py-2 text-sm">{latestScreeningInfo?.score}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-gray-500 font-medium text-sm">Interpretation</td>
                    <td className="py-2 text-sm">{latestScreeningInfo?.remark}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-gray-500 font-medium text-sm">Submitted on</td>
                    <td className="py-2 text-sm">{latestScreeningInfo?.created_at && isoToDateTime({ isoString: latestScreeningInfo?.created_at })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="font-semibold text-base mb-2">Full Screening History Table</div>
            <div className="overflow-x-auto max-w-full">
              <table className="min-w-[400px] w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-2 text-left font-semibold text-gray-500 whitespace-nowrap">Date</th>
                    <th className="py-2 px-2 text-left font-semibold text-gray-500 whitespace-nowrap">Type</th>
                    <th className="py-2 px-2 text-left font-semibold text-gray-500 whitespace-nowrap">Score</th>
                    <th className="py-2 px-2 text-left font-semibold text-gray-500 whitespace-nowrap">Risk Level</th>
                    <th className="py-2 px-2 text-left font-semibold text-gray-500 whitespace-nowrap">Max Risk % (Answer)</th>
                  </tr>
                </thead>
                <tbody>
                  {patientScreeningHistory?.map((h, idx) => {
                    const { answer } = h

                    const max_risk_percent = getMaxByKey({ arr: answer?.filter(ans => ans.alert_level == 'high' || ans?.alert_level == 'severe'), key: 'risk_level' })
                    
                    return (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="py-2 px-2 whitespace-nowrap">{h?.created_at && isoToDateTime({ isoString: h?.created_at })}</td>
                        <td className="py-2 px-2 whitespace-nowrap">{h?.test_type}</td>
                        <td className="py-2 px-2 whitespace-nowrap">{h?.score}</td>
                        <td className="py-2 px-2 whitespace-nowrap">
                          {
                            getRiskLevelBadge(h?.risk_level)
                          }
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap">{ max_risk_percent?.risk_percent }%</td>
                          <td className="py-2 gap-2 flex items-cener sm:py-3 px-2 sm:px-4 whitespace-nowrap">                        
                            <button
                              className="bg-purple-600 cursor-pointer text-white px-4 py-1 rounded-full text-xs w-full sm:w-auto transition hover:bg-grey-700"
                              onClick={() => openTestInfoModal(h)}
                            >
                              Test info
                            </button>                          
                          </td>                      
                      </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
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

export default MentalHealthScreeningDetail;
