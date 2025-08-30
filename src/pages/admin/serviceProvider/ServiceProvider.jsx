import React, { useState } from "react";

const vendors = [
  {
    name: "Dr. Grace Bello",
    type: "Full body Massage",
    status: "Pending",
    rating: 3.2,
  },
  {
    name: "Dr. Emeka Obi",
    type: "Baby sitting",
    status: "Approved",
    rating: 4.2,
  },
  { name: "Nurse Lillian James", type: "Spa", status: "Rejected", rating: 4.5 },
  {
    name: "Doula Funke Adeyemi",
    type: "Baby sitting",
    status: "Pending",
    rating: 4.4,
  },
  {
    name: "Dr. Emeka Obi",
    type: "Full body Massage",
    status: "Approved",
    rating: 2.2,
  },
];

const statusColors = {
  Pending: "bg-orange-100 text-orange-600",
  Approved: "bg-green-100 text-green-600",
  Rejected: "bg-red-100 text-red-600",
};

function ServiceProvider() {
  const [showReject, setShowReject] = useState(false);
  return (
    <div className=" pt-6 min-h-screen">
      {/* Breadcrumbs and title */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-2 sm:mb-4">
        <span>Service Providers</span>
        <span>›</span>
        <span className="text-purple-600 font-semibold">View All</span>
      </div>

      {/* service providers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Service Providers</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded font-semibold text-xs">
          Add Provider
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-200">
        {["ALL", "Pending", "Approved", "Rejected"].map((tab) => (
          <button
            key={tab}
            className={`pb-2 px-2 text-xs font-semibold border-b-2 ${
              tab === "ALL"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Table card */}
      <div className="bg-white rounded-xl p-2 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div>
            <div className="font-semibold text-sm mb-1">All Vendors</div>
            <div className="text-xs text-gray-500">
              See all your Provide below
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <input
                className="w-full border rounded px-3 py-2 text-xs"
                placeholder="Search provider"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <circle cx="7" cy="7" r="5.5" stroke="#BDBDBD" />
                  <path d="M11 11l3 3" stroke="#BDBDBD" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <button className="bg-gray-100 px-2 sm:px-3 py-2 rounded text-xs">
              Filter by: All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full divide-y text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Name
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Service Type
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Status
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Rating
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 w-max">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className=" divide-y">
              {vendors.map((v, idx) => (
                <tr key={v.name + idx} className="border-t border-gray-100">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    {v.name}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    {v.type}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        statusColors[v.status]
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>

                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap flex items-center gap-1 w-max">
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path
                        d="M8 1.333l2.06 4.175 4.607.669-3.334 3.25.787 4.586L8 11.667l-4.12 2.046.787-4.586-3.334-3.25 4.607-.669L8 1.333z"
                        fill="#FACC15"
                      />
                    </svg>
                    {v.rating}
                  </td>

                  <td className="py-2 sm:py-3 px-2 sm:px-4 w-max">
                    <div className="flex flex-col sm:flex-row w-max gap-2 items-center">
                      {v.status === "Pending" && (
                        <>
                          <button className="bg-green-600 cursor-pointer text-white px-3 py-1 rounded text-xs w-full sm:w-auto transition hover:bg-green-700">
                            Approve
                          </button>
                          <button
                            className="bg-red-600 cursor-pointer text-white px-3 py-1 rounded text-xs w-full sm:w-auto transition hover:bg-red-700"
                            onClick={() => setShowReject(true)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {(v.status === "Rejected" || v.status === "Approved") && (
                        <>
                          <button
                            className="text-purple-600 hover:bg-purple-50 cursor-pointer rounded p-2 transition"
                            title="Edit"
                          >
                            <svg
                              width="21"
                              height="20"
                              viewBox="0 0 21 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14.5514 3.73889L15.9576 2.33265C16.5678 1.72245 17.5572 1.72245 18.1674 2.33265C18.7775 2.94284 18.7775 3.93216 18.1674 4.54235L9.31849 13.3912C8.87792 13.8318 8.33453 14.1556 7.73741 14.3335L5.5 15L6.16648 12.7626C6.34435 12.1655 6.6682 11.6221 7.10877 11.1815L14.5514 3.73889ZM14.5514 3.73889L16.75 5.93749M15.5 11.6667V15.625C15.5 16.6605 14.6605 17.5 13.625 17.5H4.875C3.83947 17.5 3 16.6605 3 15.625V6.87499C3 5.83946 3.83947 4.99999 4.875 4.99999H8.83333"
                                stroke="#6F3DCB"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="text-purple-600 hover:bg-purple-50 cursor-pointer rounded p-2 transition"
                            title="View"
                          >
                            <svg
                              width="19"
                              height="12"
                              viewBox="0 0 19 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M18.4483 5.757C18.422 5.69775 17.7868 4.2885 16.3745 2.87625C14.4928 0.9945 12.116 0 9.5 0C6.884 0 4.50725 0.9945 2.62549 2.87625C1.21324 4.2885 0.574993 5.7 0.551743 5.757C0.517628 5.83373 0.5 5.91677 0.5 6.00075C0.5 6.08473 0.517628 6.16777 0.551743 6.2445C0.577993 6.30375 1.21324 7.71225 2.62549 9.1245C4.50725 11.0055 6.884 12 9.5 12C12.116 12 14.4928 11.0055 16.3745 9.1245C17.7868 7.71225 18.422 6.30375 18.4483 6.2445C18.4824 6.16777 18.5 6.08473 18.5 6.00075C18.5 5.91677 18.4824 5.83373 18.4483 5.757ZM9.5 10.8C7.1915 10.8 5.17475 9.96075 3.50524 8.30625C2.82023 7.62502 2.23743 6.84822 1.77499 6C2.23731 5.1517 2.82012 4.37488 3.50524 3.69375C5.17475 2.03925 7.1915 1.2 9.5 1.2C11.8085 1.2 13.8253 2.03925 15.4948 3.69375C16.1811 4.37472 16.7652 5.15154 17.2288 6C16.688 7.0095 14.3323 10.8 9.5 10.8ZM9.5 2.4C8.78799 2.4 8.09196 2.61114 7.49995 3.00671C6.90793 3.40228 6.44651 3.96453 6.17403 4.62234C5.90156 5.28015 5.83026 6.00399 5.96917 6.70233C6.10808 7.40066 6.45094 8.04212 6.95441 8.54559C7.45788 9.04906 8.09934 9.39192 8.79767 9.53083C9.49601 9.66973 10.2198 9.59844 10.8777 9.32597C11.5355 9.05349 12.0977 8.59207 12.4933 8.00005C12.8889 7.40804 13.1 6.71201 13.1 6C13.099 5.04553 12.7194 4.13043 12.0445 3.45551C11.3696 2.7806 10.4545 2.40099 9.5 2.4ZM9.5 8.4C9.02532 8.4 8.56131 8.25924 8.16663 7.99553C7.77195 7.73181 7.46434 7.35698 7.28269 6.91844C7.10104 6.4799 7.05351 5.99734 7.14611 5.53178C7.23872 5.06623 7.4673 4.63859 7.80294 4.30294C8.13859 3.9673 8.56623 3.73872 9.03178 3.64612C9.49734 3.55351 9.9799 3.60104 10.4184 3.78269C10.857 3.96434 11.2318 4.27195 11.4955 4.66663C11.7592 5.06131 11.9 5.52532 11.9 6C11.9 6.63652 11.6471 7.24697 11.1971 7.69706C10.747 8.14714 10.1365 8.4 9.5 8.4Z"
                                fill="#6F3DCB"
                              />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination UI (not functional) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-xs text-gray-500 gap-2">
          <button className="px-2 py-1">&lt; Previous</button>
          <div className="flex gap-1 flex-wrap">
            <button className="w-6 h-6 rounded-full bg-purple-100 text-purple-700">
              1
            </button>
            <button className="w-6 h-6 rounded-full hover:bg-purple-100">
              2
            </button>
            <span>3</span>
            <span>...</span>
            <span>8</span>
            <span>9</span>
            <button className="w-6 h-6 rounded-full hover:bg-purple-100">
              10
            </button>
          </div>
          <button className="px-2 py-1">Next &gt;</button>
        </div>
      </div>

      {/* Reject Modal */}
      {showReject && (
        <div
          className="fixed inset-0 z-[4000] cursor-pointer flex items-center justify-center bg-black/80"
          onClick={() => setShowReject(false)}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="font-semibold text-lg">Reject Business</div>
              <button
                className="text-gray-400 cursor-pointer text-xl"
                onClick={() => setShowReject(false)}
              >
                &times;
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-6">
              Are you sure you want to reject this business?
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-100 cursor-pointer px-4 py-2 rounded"
                onClick={() => setShowReject(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded"
                onClick={() => setShowReject(false)}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceProvider;
