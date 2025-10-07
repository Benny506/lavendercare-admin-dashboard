import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAdminState } from "../../../redux/slices/adminState";
import useApiReqs from "../../../hooks/useApiReqs";
import ZeroItems from "../components/ZeroItems";
import ProfileImg from "../components/ProfileImg";
import PathHeader from "../components/PathHeader";

// Utility function
function getTopProviders(bookings) {
  // Count bookings per provider
  const counts = bookings.reduce((acc, booking) => {
    acc[booking.provider_id] = (acc[booking.provider_id] || 0) + 1;
    return acc;
  }, {});

  // Group bookings by provider and attach count
  const grouped = Object.keys(counts).map((providerId) => {
    // find first booking object for that provider (keeps fields intact)
    const providerBooking = bookings.find(
      (b) => b.provider_id === providerId
    );

    return {
      ...providerBooking, // keep other fields intact from first booking
      count: counts[providerId],
    };
  });

  // Sort by count desc & pick top 5
  return grouped.sort((a, b) => b.count - a.count).slice(0, 5);
}






function CaseloadSummaries() {

  const { fetchBookings } = useApiReqs()

  const bookings = useSelector(state => getAdminState(state).bookings)

  const [searchFilter, setSearchFilter] = useState('')

  useEffect(() => {
    if((bookings || [])?.length <= 0){
      fetchBookings({})
    }
  }, [bookings])

  const providerBookings = bookings?.filter(b => b?.provider_profile ? true : false)
  const totalCases = providerBookings?.length
  const openCases = providerBookings?.filter(b => b?.status === 'new' || b?.status === 'awaiting_completion' || b?.status === 'ongoing')?.length
  const closedCases = providerBookings?.filter(b => b?.status === 'completed' || b?.status === 'cancelled' || b?.status === 'missed')?.length  

  const top5Providers = getTopProviders(providerBookings)

  const filteredData = (top5Providers || [])?.filter(p => {

    const providerName = p?.provider_profile?.provider_name || ''
    const providerTitle = p?.provider_profile?.professional_title || ''

    const matchesSearch = (
      searchFilter?.toLowerCase().includes(providerName?.toLowerCase())
      ||
      providerName?.toLowerCase().includes(searchFilter?.toLowerCase())

      ||
      searchFilter?.toLowerCase().includes(providerTitle?.toLowerCase())
      ||
      providerTitle?.toLowerCase().includes(searchFilter?.toLowerCase())      
    )

    return matchesSearch
  })

  return (
    <div className="w-full py-6">
      {/* Breadcrumbs */}
      <PathHeader 
        paths={[
          { text: 'Health Providers' },
          { text: 'Caseload summaries' },
        ]}
      />

      {/* title */}
      <div className="flex flex-col md:flex-row md:items-center py-4 md:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Caseload Summary</h2>
        <Link
          to="/admin/healthcare-provider/all-caseload"
          className="bg-(--primary-500) cursor-pointer text-white rounded-full px-4 py-2 font-semibold transition"
        >
          View All Caseload
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 flex flex-col">
          <span className="text-gray-500 text-[18px]">Total Cases</span>
          <span className="text-[40px] font-bold pt-2 leading-tight">{totalCases ?? 'Nill'}</span>
        </div>
        <div className="bg-white rounded-lg p-4 flex flex-col">
          <span className="text-gray-500 text-[18px]">Open Cases</span>
          <span className="text-[40px] font-bold pt-2 leading-tight">{openCases ?? 'Nill'}</span>
        </div>
        <div className="bg-white rounded-lg p-4 flex flex-col">
          <span className="text-gray-500 text-[18px]">Closed Cases</span>
          <span className="text-[40px] font-bold pt-2 leading-tight">{closedCases ?? 'Nill'}</span>
        </div>
      </div>

      {/* Top Providers Table */}
      <div className="bg-white rounded-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <h3 className="font-semibold text-lg">Top 5 Providers by Caseload</h3>
          <div className="relative w-full md:w-64">
            <input
              value={searchFilter}
              onChange={e => setSearchFilter(e?.target?.value)}
              type="text"
              placeholder="Search"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary-200)"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-2 text-left font-medium">
                  Providers Name
                </th>
                <th className="py-2 px-2 text-left font-medium">
                  Avg Consults/mo
                </th>
                <th className="py-2 px-2 text-left font-medium flex justify-end mr-14">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredData?.length > 0
                ?
                  filteredData.map((p, idx) => {
                    return (
                      <tr
                        key={idx}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="py-2 px-2 flex items-center gap-3">
                          <ProfileImg 
                            profile_img={p?.profile_img}
                            name={p?.provider_profile?.provider_name}
                            size="8"
                          />
                          <div>
                            <div className="font-semibold">{p?.provider_profile?.provider_name}</div>
                            <div className="text-xs text-gray-500">{p?.provider_profile?.professional_title}</div>
                          </div>
                        </td>
                        <td className="py-2 px-2">{p?.count}</td>
                        <td className="py-2 flex justify-end mr-8 px-2">
                          <button
                            className="bg-(--primary-500) text-white rounded-full px-3 py-1 font-medium transition"
                            onClick={() => navigate("/admin/all-caseload")}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                  )})
                :
                  <tr className="border-b last:border-b-0 hover:bg-gray-50">
                    <td colSpan={'6'} className="pt-5">
                      <ZeroItems zeroText={'No providers found'} />
                    </td>
                  </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* All Caseload Modal/Table removed; now handled by separate page */}
    </div>
  );
}

export default CaseloadSummaries;
