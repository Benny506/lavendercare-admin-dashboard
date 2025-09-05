import React from "react";
import { Link } from "react-router-dom";

const providerDetails = [
  {
    name: "Dr. Jane Smith",
    type: "Psychiatrist",
    rating: "4.8",
    responseRate: "95%",
    totalServices: "124",
  },
  {
    name: "Dr. Jane Smith",
    type: "Psychiatrist",
    rating: "4.8",
    responseRate: "95%",
    totalServices: "124",
  },
  {
    name: "Dr. Jane Smith",
    type: "Psychiatrist",
    rating: "4.8",
    responseRate: "95%",
    totalServices: "124",
  },
  {
    name: "Dr. Jane Smith",
    type: "Psychiatrist",
    rating: "4.8",
    responseRate: "95%",
    totalServices: "124",
  },
  {
    name: "Dr. Jane Smith",
    type: "Psychiatrist",
    rating: "4.8",
    responseRate: "95%",
    totalServices: "124",
  },
  {
    name: "Dr. Jane Smith",
    type: "Psychiatrist",
    rating: "4.8",
    responseRate: "95%",
    totalServices: "124",
  },
  {
    name: "Dr. Jane Smith",
    type: "Psychiatrist",
    rating: "4.8",
    responseRate: "95%",
    totalServices: "124",
  },
];

function ProviderVendor() {
  return (
    <div className="pt-6 w-full mb-12 min-h-screen">
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
          Provider & Vendor
        </p>
      </div>

      {/* title */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full">
        <h2 className="text-lg sm:text-[24px] font-bold mb-4">
          Provider & Vendor
        </h2>

        {/*  */}
        <div className="flex gap-2 text-[12px] w-max rounded-sm border-[#DEE0E3] border">
          <p className="py-1 w-max text-white bg-(--primary-500) rounded-l-sm px-2">
            Providers
          </p>
          <p className="py-1 w-max pr-2">Vendors</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col bg-white border border-[#E5E7EB] py-3 rounded-[8px] pr-4 md:flex-row md:items-center md:justify-end gap-2 mb-4">
        {/* filter tray tab */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <svg
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.0835 1.33325V3.99992"
                stroke="#565655"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.4165 1.33325V3.99992"
                stroke="#565655"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.4167 2.66675H4.08333C3.34695 2.66675 2.75 3.2637 2.75 4.00008V13.3334C2.75 14.0698 3.34695 14.6667 4.08333 14.6667H13.4167C14.153 14.6667 14.75 14.0698 14.75 13.3334V4.00008C14.75 3.2637 14.153 2.66675 13.4167 2.66675Z"
                stroke="#565655"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.75 6.66675H14.75"
                stroke="#565655"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <select className="border pl-8 border-gray-200 rounded-lg py-2 text-xs sm:text-sm focus:outline-none">
              <option>Aug 10, 2025 - Aug 17, 2025</option>
            </select>
          </div>

          <button className="border flex items-center gap-1 border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50">
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1966_83139)">
                <path
                  d="M7.07284 13.3333C7.07278 13.4572 7.10725 13.5787 7.17237 13.6841C7.23749 13.7895 7.33068 13.8746 7.44151 13.93L8.77484 14.5967C8.8765 14.6475 8.98947 14.6714 9.103 14.6663C9.21654 14.6612 9.32687 14.6271 9.42353 14.5673C9.52018 14.5075 9.59995 14.424 9.65525 14.3247C9.71056 14.2254 9.73956 14.1137 9.73951 14V9.33333C9.73966 9.00292 9.86248 8.68433 10.0842 8.43933L14.8995 3.11333C14.9858 3.01771 15.0426 2.89912 15.0629 2.77192C15.0832 2.64472 15.0663 2.51435 15.0141 2.39658C14.9619 2.27881 14.8767 2.17868 14.7688 2.1083C14.661 2.03792 14.535 2.0003 14.4062 2H2.40617C2.27724 2.00005 2.15109 2.03748 2.04301 2.10776C1.93492 2.17804 1.84953 2.27815 1.79718 2.39598C1.74483 2.5138 1.72776 2.64427 1.74806 2.77159C1.76835 2.89892 1.82512 3.01762 1.91151 3.11333L6.72817 8.43933C6.94986 8.68433 7.07269 9.00292 7.07284 9.33333V13.3333Z"
                  stroke="#565655"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1966_83139">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(0.40625)"
                  />
                </clipPath>
              </defs>
            </svg>
            Filters
          </button>
          <button className="border flex items-center gap-1 border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50">
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.90625 10V2"
                stroke="#565655"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.9063 10V12.6667C14.9063 13.0203 14.7658 13.3594 14.5157 13.6095C14.2657 13.8595 13.9265 14 13.5729 14H4.23958C3.88596 14 3.54682 13.8595 3.29677 13.6095C3.04673 13.3594 2.90625 13.0203 2.90625 12.6667V10"
                stroke="#565655"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.57275 6.66675L8.90609 10.0001L12.2394 6.66675"
                stroke="#565655"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Export CSV
          </button>
          <button className="border flex items-center gap-1 border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50">
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.90625 10V2"
                stroke="#565655"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.9063 10V12.6667C14.9063 13.0203 14.7658 13.3594 14.5157 13.6095C14.2657 13.8595 13.9265 14 13.5729 14H4.23958C3.88596 14 3.54682 13.8595 3.29677 13.6095C3.04673 13.3594 2.90625 13.0203 2.90625 12.6667V10"
                stroke="#565655"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.57275 6.66675L8.90609 10.0001L12.2394 6.66675"
                stroke="#565655"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* provider Details Table */}
      <div className="bg-white rounded-xl p-4">
        <div className="text-lg font-bold mb-4">
          Top 10 providers by Performance
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Name
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Type
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Rating
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Response rate
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Total services
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {providerDetails.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {row.name}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {row.type}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {row.rating}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {row.responseRate}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {row.totalServices}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/admin/provider/${row.id}`}
                      className="text-(--primary-500) flex items-center gap-1 font-medium cursor-pointer"
                    >
                      View profile
                      <svg
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.46875 1.75H12.9687V5.25"
                          stroke="#6F3DCB"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6.55225 8.16667L12.9689 1.75"
                          stroke="#6F3DCB"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M11.2187 7.58333V11.0833C11.2187 11.3928 11.0958 11.6895 10.877 11.9083C10.6582 12.1271 10.3615 12.25 10.0521 12.25H3.63542C3.326 12.25 3.02925 12.1271 2.81046 11.9083C2.59167 11.6895 2.46875 11.3928 2.46875 11.0833V4.66667C2.46875 4.35725 2.59167 4.0605 2.81046 3.84171C3.02925 3.62292 3.326 3.5 3.63542 3.5H7.13542"
                          stroke="#6F3DCB"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid mt-4 grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 flex flex-col">
          <div className="text-xs text-gray-400 mb-2">
            Response Rate Distribution
          </div>
          {/* Chart Placeholder */}
          <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            [Line Chart]
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col">
          <div className="text-xs text-gray-400 mb-2">
            Services Delivered Over Time
          </div>
          {/* Chart Placeholder */}
          <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            [Bar Chart]
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderVendor;
