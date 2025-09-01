import React from "react";

const payouts = [
  {
    vendor: "Tech Solutions Inc.",
    user: "Dr. Emeka Obi",
    amount: "₦5,200",
    date: "May 1, 2025",
    status: "Approval",
  },
  {
    vendor: "Creative Designs Co.",
    user: "Dr. Emeka Obi",
    amount: "₦3,800",
    date: "August 20, 2025",
    status: "Approval",
  },
  {
    vendor: "Global Supplies Ltd.",
    user: "Nurse Lillian James",
    amount: "₦7,500",
    date: "July 8, 2025",
    status: "Approval",
  },
  {
    vendor: "Invokele Systems LLC",
    user: "Doula Funke Adeyemi",
    amount: "₦2,900",
    date: "August 10, 2025",
    status: "Pending",
  },
  {
    vendor: "Marketing Pros Agency",
    user: "Dr. Emeka Obi",
    amount: "₦1,500",
    date: "Sept 1, 2025",
    status: "Rejected",
  },
];

function PayoutRequests() {
  return (
    <div className="w-full py-6">
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
        <span className="text-(--primary-500) font-semibold">Refunds</span>
      </div>

      {/* payout titles */}
      <h2 className="text-xl md:text-2xl font-bold mb-2">Payout Requests</h2>

      {/* overall table data */}
      <div className="bg-white rounded-lg mt-4 p-4">
        {/* manage process text info */}
        <div className="flex overflow-x-auto flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div>
            <h3 className="font-semibold text-lg">
              Manage and process vendor payout requests.
            </h3>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search doctor or mother"
              className="w-[320px] md:w-64 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary-200)"
            />
            <select className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700">
              <option>Filter by: All</option>
            </select>
            <select className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700">
              <option>Last 30 days</option>
            </select>
          </div>
        </div>

        {/* table list data */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-2 text-left font-medium">Vendor Name</th>
                <th className="py-2 px-2 text-left font-medium">User</th>
                <th className="py-2 px-2 text-left font-medium">
                  Amount Requested
                </th>
                <th className="py-2 px-2 text-left font-medium">
                  Request Date
                </th>
                <th className="py-2 px-2 text-left font-medium">
                  Payment Status
                </th>
                <th className="py-2 px-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p, idx) => (
                <tr
                  key={p.vendor}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="py-2 px-2">{p.vendor}</td>
                  <td className="py-2 px-2">{p.user}</td>
                  <td className="py-2 px-2">{p.amount}</td>
                  <td className="py-2 px-2">{p.date}</td>
                  <td className="py-2 px-2">
                    {p.status === "Approval" && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                        Approval
                      </span>
                    )}
                    {p.status === "Pending" && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600">
                        Pending
                      </span>
                    )}
                    {p.status === "Rejected" && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 flex gap-2">
                    {p.status === "Approval" && (
                      <>
                        <button
                          title="Edit"
                          className="text-(--primary-500) hover:underline"
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="#8B8B8A"
                              strokeWidth="2"
                              d="M16.862 5.487a2.06 2.06 0 1 1 2.915 2.914L8.5 19.678l-4 1 1-4 13.277-13.277Z"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                    {p.status === "Pending" && (
                      <>
                        <button className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-semibold">
                          Approve
                        </button>
                        <button className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                          Reject
                        </button>
                      </>
                    )}
                    {p.status === "Rejected" && (
                      <>
                        <button className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-semibold">
                          Approve
                        </button>
                        <button className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
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
        </div>
      </div>
    </div>
  );
}

export default PayoutRequests;
