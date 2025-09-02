import React from "react";

const TransactionHistory = () => {
  return (
    <div className="pt-6 w-full min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
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
        <span>Orders & Transactions</span>
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
        <span className="text-(--primary-500) font-semibold">
          Transaction history
        </span>
      </div>

      {/* Title & Description */}
      <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
        Transaction History
      </h2>
      <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">
        Manage and process vendor payout requests.
      </p>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search doctor or mother"
            className="border border-gray-200 rounded-lg px-3 py-2 w-full md:w-64 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <button className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50 whitespace-nowrap">
            Export CSV
          </button>
          <select className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-xs sm:text-sm focus:outline-none">
            <option>Latest</option>
            <option>Oldest</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Reference ID
              </th>
              <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                May 1, 2025
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Order</td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">₦8,200</td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-primary font-medium">
                ORD-23423
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                <button className="text-primary font-medium text-xs sm:text-sm">
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                August 30, 2025
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Refund</td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">₦4,200</td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-primary font-medium">
                REF-47890
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                <button className="text-primary font-medium text-xs sm:text-sm">
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                July 2, 2025
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Payout</td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">₦12,000</td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-primary font-medium">
                PAY-11233
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                <button className="text-primary font-medium text-xs sm:text-sm">
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                August 18, 2025
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Order</td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">₦8,200</td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-primary font-medium">
                ORD-33443
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                <button className="text-primary font-medium text-xs sm:text-sm">
                  View
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                Sept 6, 2025
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Refund</td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">₦1,500</td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-primary font-medium">
                REF-69067
              </td>
              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                <button className="text-primary font-medium text-xs sm:text-sm">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 gap-2">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-0 cursor-pointer">
            Previous
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-primary text-white text-xs sm:text-sm">
              1
            </button>
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">
              2
            </button>
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">
              3
            </button>
            <span className="text-gray-400">...</span>
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">
              6
            </button>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 cursor-pointer">
            Next
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
