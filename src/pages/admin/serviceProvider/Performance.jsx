import React, { useEffect, useRef, useState } from "react";
import PathHeader from "../components/PathHeader";
import { useDispatch, useSelector } from "react-redux";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";
import supabase from "../../../database/dbInit";
import { useReactToPrint } from "react-to-print";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { getAdminState } from "../../../redux/slices/adminState";
import useApiReqs from "../../../hooks/useApiReqs";

function getMonthlyCounts(data) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const counts = {};

  data.forEach(item => {
    const date = new Date(item.day);
    const month = monthNames[date.getMonth()];

    counts[month] = (counts[month] || 0) + 1;
  });

  return Object.entries(counts).map(([month, count]) => ({
    month,
    count
  }));
}


function Performance() {
  const dispatch = useDispatch()

  const { fetchBookings } = useApiReqs()

  const containerRef = useRef(null)

  const downloadEntireDoc = useReactToPrint({
    contentRef: containerRef
  });

  const bookings = useSelector(state => getAdminState(state).bookings)

  const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })
  const [stats, setStats] = useState({ avgRating: null, allBookings: null, completedBookings: null })

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
    if(bookings?.length === 0){
      fetchBookings({})
    }
  }, [bookings])

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if (isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop());

    if (isLoading && data) {
      const { type } = data

      if (type === 'initialFetch') {
        initialFetch()
      }
    }
  }, [apiReqs])

  const initialFetch = async () => {
    try {
      const { data: avgRating, error: avgRatingError } = await supabase.rpc("get_avg_service_rating")

      const { count: completedBookings, error: completedBookingsError } = await supabase
        .from('all_bookings')
        .select('*', { count: 'exact', head: true })
        .is("provider_id", null)
        .eq("status", "completed")

      const { count: allBookings, error: allBookingsError } = await supabase
        .from('all_bookings')
        .select('*', { count: 'exact', head: true })
        .is("provider_id", null)


      if (avgRatingError || completedBookingsError || allBookingsError) {
        console.log("avgRatingError", avgRatingError)
        console.log("completedBookingsError", completedBookingsError)
        console.log("allBookingsError", allBookingsError)
        throw new Error()
      }

      setStats({
        avgRating,
        allBookings,
        completedBookings
      })

      setApiReqs({ isLoading: false, data: null, errorMsg: null })

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

  const avgResponseRate =
    stats.allBookings && stats.completedBookings
      ?
      (stats.completedBookings * 100) / stats.allBookings
      :
      0

  const completedVendorBookings = (bookings || [])?.filter(b => {
    b?.vendor_id && b?.status === 'completed'
  })

  return (
    <div ref={containerRef} className=" pt-6 min-h-screen">
      {/* Breadcrumbs */}
      <PathHeader
        paths={[
          { text: 'Services' },
          { text: 'Performance' },
        ]}
      />

      {/* service provider header */}
      <div className="flex flex-col gap-4 md:flex-row items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          Service Performance
        </h2>

        {/* Filters */}
        <div onClick={downloadEntireDoc} className="cursor-pointer flex w-max flex-wrap gap-2 justify-end">
          <button className="border-gray-300 border bg-white flex items-center gap-2 px-2 sm:px-3 py-2 rounded text-xs">
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
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 flex flex-col items-start min-w-[150px]">
          <span className="text-xs text-gray-500 mb-1">Avg Rating</span>
          <span className="text-3xl font-bold">
            {stats.avgRating ?? "-"}
          </span>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col items-start min-w-[150px]">
          <span className="text-xs text-gray-500 mb-1">Response Rate</span>
          <span className="text-3xl font-bold">
            {`${avgResponseRate ?? 0}%`}
          </span>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col items-start min-w-[150px]">
          <span className="text-xs text-gray-500 mb-1">
            Appointments Delivered
          </span>
          <span className="text-3xl font-bold">
            {stats.completedBookings ?? '-'}
          </span>
        </div>
      </div>

      {/* Appointments Trend */}
      <div className="bg-white rounded-[16px] mb-6">
        <h2 className="font-semibold text-[21px] pt-5 pl-4">
          Appointments Trend
        </h2>

        <div className="w-full p-4 gap-4">
          {/* Appointments Over Time */}
          <div className="bg-white border border-gray-300 rounded-xl p-4 flex flex-col min-h-[300px] h-[300px] md:h-[350px]">
            <div className="font-semibold">Growth Chart for completed appointments</div>
            <div className="flex-1 flex items-center justify-center">
              {/* Chart Placeholder */}
              <div className="w-full h-32 sm:h-40 md:h-48 bg-purple-50 rounded-lg flex items-center justify-center text-purple-200 text-lg font-bold">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart
                    data={getMonthlyCounts(completedVendorBookings)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#6b46c1"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Performance;
