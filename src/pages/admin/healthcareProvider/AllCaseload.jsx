import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAdminState } from "../../../redux/slices/adminState";
import useApiReqs from "../../../hooks/useApiReqs";
import { isoToDateTime } from "../../../lib/utils";
import { allStatus, getStatusBadge } from "../../../lib/utils_Jsx";
import ZeroItems from "../components/ZeroItems";
import { Select } from "../components/ui/Select";
import PathHeader from "../components/PathHeader";
import { useNavigate } from "react-router-dom";

function AllCaseload() {

  const navigate = useNavigate()

  const { fetchBookings } = useApiReqs()

  const bookings = useSelector(state => getAdminState(state).bookings)

  const [searchFilter, setSearchFilter] = useState('')
  const [statusTab, setStatusTab] = useState('')

  useEffect(() => {
    if((bookings || [])?.length <= 0){
      fetchBookings({})
    
    }
  }, [bookings])

  const filteredData = (bookings || [])?.filter(b => {

    const motherName = b?.user_profile?.name || ''
    const providerName = b?.provider_profile?.provider_name || ''
    const careType = b?.service_type || ''

    const matchesSearch = (
      (searchFilter?.toLowerCase().includes(motherName?.toLowerCase())
      ||
      motherName?.toLowerCase().includes(searchFilter?.toLowerCase()))

      ||

      (searchFilter?.toLowerCase().includes(providerName?.toLowerCase())
      ||
      providerName?.toLowerCase().includes(searchFilter?.toLowerCase()))
      
      ||

      (searchFilter?.toLowerCase().includes(careType?.toLowerCase())
      ||
      careType?.toLowerCase().includes(searchFilter?.toLowerCase()))      
    )

    const matchesStatusTab = (statusTab === 'all' || !statusTab) ? true : statusTab === b?.status

    return matchesSearch && matchesStatusTab
  })

  return (
    <div className="w-full py-6">
      {/* Breadcrumbs */}
      <PathHeader
        paths={[
          { text: 'Health Providers' },
          { text: 'All Caseloads' },
        ]}
      />      

      <div className="bg-white mt-6 rounded-lg">
        {/* title */}
        <div className="flex flex-col px-4 md:flex-row md:items-center py-4 md:justify-between mb-4 gap-2">
          <div>
            <h3 className="font-bold text-xl">All Caseload</h3>
            <p className="text-gray-500 text-sm">See all your caseload below</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              value={searchFilter}
              onChange={e => setSearchFilter(e?.target?.value)}
              type="text"
              placeholder="Search doctor or mother or care type"
              className="w-full md:w-64 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary-200)"
            />
            <Select
              searchable={true}
              options={[{ title: 'All', type: 'all' }, ...allStatus].map(s => {
                return {
                  value: s.type,
                  label: s.title
                }
              })}
              value={statusTab}
              onChange={setStatusTab}
              placeholder="Filter by status"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 text-left font-medium">
                  Mother's Name
                </th>
                <th className="py-2 px-4 text-left font-medium">
                  Assigned Doctor
                </th>
                <th className="py-2 px-4 text-left font-medium">Care Type</th>
                <th className="py-2 px-4 text-left font-medium">
                  Consult Date
                </th>
                <th className="py-2 px-4 text-left font-medium">Status</th>
                <th className="py-2 px-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredData?.length > 0
                ?
                  filteredData.map((c, idx) => {
                    return (
                      <tr
                        key={idx}
                        className="border-b cursor-pointer last:border-b-0 hover:bg-gray-50"
                        onClick={() => navigate('/admin/user-management/booking-information', { state: { mother: c?.user_profile, bookingInfo: c } })}
                      >
                        <td className="py-2 px-4">{c?.user_profile?.name}</td>
                        <td className="py-2 px-4">{c?.provider_profile?.provider_name}</td>
                        <td className="py-2 px-4">{c?.service_type?.replaceAll("_", " ")}</td>
                        <td className="py-2 px-4">{c?.created_at && isoToDateTime({ isoString: c?.created_at })}</td>
                        <td className="py-2 px-4">
                          { getStatusBadge(c?.status) }
                        </td>
                        <td className="py-2 px-2">
                          <div 
                            className="cursor-pointer bg-(--primary-100) text-(--primary-500) hover:bg-(--primary-200) rounded-lg px-3 py-1 font-medium transition"
                          >
                            View
                          </div>
                        </td>
                      </tr>
                  )})
                :
                  <tr className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="pt-5" colSpan={'6'}>
                      <ZeroItems zeroText={'No caseloads found'} />
                    </td>
                  </tr>
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {/* <div className="flex justify-between items-center py-3 px-6 mt-4">
          <button className="text-(--primary-500) font-semibold">
            &larr; Previous
          </button>
          <div className="flex gap-1">
            {[1, 2, 3, "...", 10].map((n, i) => (
              <button
                key={i}
                className={`px-2 py-1 rounded ${
                  n === 1
                    ? "bg-(--primary-100) text-(--primary-500)"
                    : "text-gray-700"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <button className="text-(--primary-500) font-semibold">
            Next &rarr;
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default AllCaseload;
