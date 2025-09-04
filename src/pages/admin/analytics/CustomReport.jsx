import React, { useState } from "react";

const metrics = [
  "Sales",
  "Orders",
  "Daily Active Users",
  "Sign-ups",
  "Bookings",
  "Consultations",
  "+ Add Metric",
];
const tableData = [
  { date: "Jan 01", sales: 4000 },
  { date: "Jan 02", sales: 3000 },
  { date: "Jan 03", sales: 5000 },
  { date: "Jan 04", sales: 2780 },
  { date: "Jan 05", sales: 1890 },
  { date: "Jan 06", sales: 2390 },
  { date: "Jan 07", sales: 3490 },
];

function CustomReport() {
  const [chartType, setChartType] = useState("line");

  return (
    <div className="pt-6 w-full min-h-screen">
      {/* Breadcrumb */}
        <div className="flex pb-4 items-center gap-1">
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
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_1918_35894)">
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
        <p className="text-[12px]">Analytics</p>
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
        <p className="text-(--primary-500) font-[600] text-[12px]">
          Custom report builder
        </p>
      </div>

      <h2 className="text-lg sm:text-[24px] font-bold mb-4">
        Custom Report Builder
      </h2>

      {/* custom reprt builder wrapper */}
      <div className="bg-white p-4 mb-8 rounded-sm">
        {/* Controls */}
        <span className="font-semibold text-[18px] mr-2">Metrics</span>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            {metrics.map((m, idx) => (
              <button
                key={idx}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                  idx === 0
                    ? "bg-(--primary-500)/10 border-(--primary-500) text-(--primary-500) border"
                    : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex gap-2 justify-between items-center">
            {/* dimension */}
            <div className="flex flex-col gap-2 items-center md:mt-0">
              <span className="font-semibold text-sm">Dimension</span>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm bg-white text-gray-700 focus:outline-none">
                <option>Date</option>
              </select>
            </div>

            {/* chart type */}
            <div className="flex flex-col gap-2 items-center md:mt-0">
              <span className="font-semibold text-sm">Chart Type</span>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${
                    chartType === "line"
                      ? "bg-(--primary-500) text-white"
                      : "bg-white t border border-gray-200"
                  }`}
                  onClick={() => setChartType("line")}
                >
                  <svg
                    stroke={chartType === "line" ? "white" : "black"}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 2V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H14"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.6665 6L9.33317 9.33333L6.6665 6.66667L4.6665 8.66667"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${
                    chartType === "bar"
                      ? "bg-(--primary-500) text-white"
                      : "bg-white text-black border border-gray-200"
                  }`}
                  onClick={() => setChartType("bar")}
                >
                  <svg
                    width="16"
                    stroke={chartType === "bar" ? "white" : "black"}
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 2V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H14"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 11.3333V6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.6665 11.3335V3.3335"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.3335 11.3335V9.3335"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white">
          {chartType === "line" ? (
            <div className="w-full h-[320px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-4">
              [Line Chart]
            </div>
          ) : (
            <div className="w-full h-[320px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-4">
              [Bar Chart]
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y border border-gray-200 rounded-sm divide-gray-200 text-xs sm:text-sm">
              <thead className="bg-gray-50 ">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                    Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                    Sales
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {row.sales}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-6 justify-end">
            <button className="py-2 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium text-xs sm:text-sm">
              Save Template
            </button>
            <button className="py-2 px-4 rounded-lg bg-(--primary-500) text-white font-medium text-xs sm:text-sm">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomReport;
