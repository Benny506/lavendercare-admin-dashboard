import React from "react";
import { useNavigate } from "react-router-dom";

const disputes = [
  {
    id: "12345",
    provider: "Spa in Lekki",
    user: "Sophia Bennett",
    type: "Billing Dispute",
    status: "In Progress",
  },
  {
    id: "4239",
    provider: "Babysitter in Ikeji",
    user: "Ethan Walker",
    type: "Technical Problem",
    status: "Resolved",
  },
  {
    id: "9203",
    provider: "Spa in Lekki",
    user: "Ava Thompson",
    type: "Billing Dispute",
    status: "Resolved",
  },
  {
    id: "9729",
    provider: "Nurse Lillian James",
    user: "Liam Cooper",
    type: "Technical Problem",
    status: "Open",
  },
  {
    id: "8749",
    provider: "Doula Funke Adeyemi",
    user: "Mia Hughes",
    type: "Billing Dispute",
    status: "Open",
  },
];

const statusColors = {
  "In Progress": "bg-orange-100 text-orange-600",
  Resolved: "bg-green-100 text-green-600",
  Open: "bg-red-100 text-red-600",
};

function Disputes() {
  const navigate = useNavigate();
  return (
    <div className=" pt-6 min-h-screen">
      {/* breadcrumbs */}
      <div className="flex pb-6 items-center gap-1">
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
        <p className="text-[12px]">Service providers</p>
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
        <p className="text-(--primary-500) font-[600] text-[12px]">Disputes and issues</p>
      </div>

      {/* disputes header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
            Disputes & Issues
          </h2>
          <div className="text-xs text-gray-500 mb-4">
            Manage and resolve disputes and issues related to service providers.
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 justify-end w-max">
          <select className="bg-white px-2 flex items-center gap-3 sm:px-3 py-2 rounded text-xs">
            <option>Assign to Me </option>
            <option>Assign to others</option>
          </select>

          <select className="bg-white px-2 flex items-center gap-3 sm:px-3 py-2 rounded text-xs">
            <option>in progress</option>
            <option>resolved</option>
            <option>Open</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row border-b border-gray-300 pb-4 sm:items-center sm:justify-between gap-2 mb-2">
          <div className="font-semibold text-sm mb-2 sm:mb-0">All Disputes</div>
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
        <div className="overflow-x-auto  border border-gray-100">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Issue ID
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Provider
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  User Name
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Issue Type
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Status
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((d, idx) => (
                <tr key={d.id} className="border-t border-gray-100">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    #{d.id}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    {d.provider}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    {d.user}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    {d.type}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        statusColors[d.status]
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    <button
                      className="bg-purple-600 text-white px-4 py-1 rounded"
                      onClick={() =>
                        navigate(`/admin/service-provider/disputes/${d.id}`)
                      }
                    >
                      View
                    </button>
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
    </div>
  );
}

export default Disputes;
