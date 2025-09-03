import React from "react";

const summaryStats = [
  { label: "Total Sales", value: "$123,456" },
  { label: "Average Order Value", value: "$89" },
  { label: "Gross Profit", value: "$45,678" },
  { label: "Refund Rate", value: "2.5%" },
];

const recentSales = [
  {
    date: "2024-07-01",
    product: "Yoga Mat",
    quantity: 2,
    sales: "$1,345",
    profit: "$45",
  },
  {
    date: "2024-07-02",
    product: "Compression Socks",
    quantity: 6,
    sales: "$1,345",
    profit: "$45",
  },
  {
    date: "2024-07-03",
    product: "Hand Sanitizer",
    quantity: 1,
    sales: "$1,345",
    profit: "$45",
  },
];

function Analytics() {
  return (
    <div className="pt-6 w-full min-h-screen mb-8">
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
          Sales and Revenue
        </p>
      </div>

      {/* sales title */}
      <div className="flex items-center mb-4 justify-between">
        <h2 className="text-lg sm:text-xl font-bold">
          Sales & Revenue Reports
        </h2>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-center justify-end">
          <button className="border border-gray-200 flex items-center gap-2 rounded-lg px-4 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50">
            Export CSV{" "}
            <svg
              width="18"
              height="14"
              viewBox="0 0 18 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 10.6923L9 5.15388M9 5.15388L11.4615 7.61542M9 5.15388L6.53846 7.61542M4.69231 13.1539C2.6531 13.1539 1 11.5008 1 9.46158C1 7.82634 2.06302 6.43938 3.53571 5.95404C3.48701 5.69477 3.46154 5.4273 3.46154 5.15388C3.46154 2.77481 5.39016 0.846191 7.76923 0.846191C9.76409 0.846191 11.4422 2.20217 11.9322 4.0427C12.1716 3.96507 12.4271 3.92311 12.6923 3.92311C14.0518 3.92311 15.1538 5.02518 15.1538 6.38465C15.1538 6.67031 15.1052 6.9446 15.0157 7.19968C16.1757 7.64041 17 8.76242 17 10.077C17 11.7763 15.6224 13.1539 13.9231 13.1539H4.69231Z"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <select className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-700 text-xs sm:text-sm focus:outline-none">
            <option>This Month</option>
            <option>Last Month</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6">
        {summaryStats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-sm p-4 flex flex-col items-start"
          >
            <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 bg-white md:grid-cols-2 p-4 rounded-[16px] gap-4 mb-6">
        <div className="bg-white rounded-xl border-[#DEE0E3] border p-4 flex flex-col">
          <div className="text-xs text-gray-400 mb-2">Revenue Trend</div>
          <div className="text-2xl font-semibold mb-1">1,250</div>
          <div className="text-xs text-gray-500 mb-2">
            Last 30 Days{" "}
            <span className="text-green-500 font-semibold">+20%</span>
          </div>
          {/* Chart Placeholder */}
          <div className="w-full h-32 sm:h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            [Line Chart]
          </div>
        </div>
        <div className="bg-white rounded-xl border-[#DEE0E3] border p-4 flex flex-col">
          <div className="text-xs text-gray-400 mb-2">Daily Orders</div>
          <div className="text-2xl font-semibold mb-1">75</div>
          <div className="text-xs text-gray-500 mb-2">
            Last 30 Days{" "}
            <span className="text-red-500 font-semibold">-20%</span>
          </div>
          {/* Chart Placeholder */}
          <div className="w-full h-32 sm:h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            [Bar Chart]
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white rounded-xl p-4">
        <div className="text-lg font-bold mb-4">Recent Sales</div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Date
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Product
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Quantity
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Sales
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Profit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentSales.map((sale, idx) => (
                <tr key={idx}>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {sale.date}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {sale.product}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {sale.quantity}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {sale.sales}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {sale.profit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
