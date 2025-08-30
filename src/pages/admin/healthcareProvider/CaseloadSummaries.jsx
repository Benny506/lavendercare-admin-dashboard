import React from "react";
import { Link } from "react-router-dom";

const providers = [
  {
    name: "Dr. Grace Bello",
    role: "Postnatal Recovery",
    avgConsults: 150,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Dr. Emeka Obi",
    role: "OB-GYN",
    avgConsults: 140,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Nurse Lillian James",
    role: "Postpartum Therapy",
    avgConsults: 130,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Dr. David Okorie",
    role: "General Practitioner",
    avgConsults: 120,
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Doula Funke Adeyemi",
    role: "Birth & Labor Support",
    avgConsults: 110,
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
  },
];

const caseloadData = [
  {
    mother: "Sarah Adebayo",
    doctor: "Dr. Emeka Obi",
    careType: "Medical",
    lastConsult: "2025-07-06",
    status: "Open",
  },
  {
    mother: "Chinenye Okeke",
    doctor: "Dr. Emeka Obi",
    careType: "Mental",
    lastConsult: "2025-07-05",
    status: "Open",
  },
  {
    mother: "Fatima Musa",
    doctor: "Nurse Lillian James",
    careType: "Physical",
    lastConsult: "2025-07-04",
    status: "Open",
  },
  {
    mother: "Ifeoma Nwachukwu",
    doctor: "Doula Funke Adeyemi",
    careType: "Medical",
    lastConsult: "2025-07-03",
    status: "Closed",
  },
  {
    mother: "Kemi Alade",
    doctor: "Dr. Emeka Obi",
    careType: "Mental",
    lastConsult: "2025-07-02",
    status: "Closed",
  },
];

function CaseloadSummaries() {
  return (
    <div className="w-full py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1">
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
        <p className="text-[12px]">Health providers</p>
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
          Caseload summaries
        </p>
      </div>

      {/* title */}
      <div className="flex flex-col md:flex-row md:items-center py-4 md:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Caseload Summary</h2>
        <Link
          to="/admin/all-caseload"
          className="bg-(--primary-500) cursor-pointer text-white rounded-full px-4 py-2 font-semibold transition"
        >
          View All Caseload
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 flex flex-col">
          <span className="text-gray-500 text-[18px]">Total Cases</span>
          <span className="text-[40px] font-bold pt-2 leading-tight">1250</span>
        </div>
        <div className="bg-white rounded-lg p-4 flex flex-col">
          <span className="text-gray-500 text-[18px]">Open Cases</span>
          <span className="text-[40px] font-bold pt-2 leading-tight">850</span>
        </div>
        <div className="bg-white rounded-lg p-4 flex flex-col">
          <span className="text-gray-500 text-[18px]">Closed Cases</span>
          <span className="text-[40px] font-bold pt-2 leading-tight">400</span>
        </div>
      </div>

      {/* Top Providers Table */}
      <div className="bg-white rounded-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <h3 className="font-semibold text-lg">Top 5 Providers by Caseload</h3>
          <div className="relative w-full md:w-64">
            <input
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
              {providers.map((p, idx) => (
                <tr
                  key={p.name}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="py-2 px-2 flex items-center gap-3">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.role}</div>
                    </div>
                  </td>
                  <td className="py-2 px-2">{p.avgConsults}</td>
                  <td className="py-2 flex justify-end mr-8 px-2">
                    <button
                      className="bg-(--primary-500) text-white rounded-full px-3 py-1 font-medium transition"
                      onClick={() => navigate("/admin/all-caseload")}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Caseload Modal/Table removed; now handled by separate page */}
    </div>
  );
}

export default CaseloadSummaries;
