import React from "react";
import { useNavigate } from "react-router-dom";

const screenings = [
  {
    date: "25-07-11 ~3:45PM*",
    mother: "Sophia Bennett",
    score: 18,
    interpretation: "Moderate Depression",
    risk: "None",
    riskColor: "text-green-500 bg-green-50",
    interpColor: "text-green-500",
  },
  {
    date: "25-07-11 ~3:45PM*",
    mother: "Ethan Walker",
    score: 24,
    interpretation: "Severe Depression",
    risk: "High",
    riskColor: "text-red-500 bg-red-50",
    interpColor: "text-red-500",
  },
  {
    date: "25-07-11 ~3:45PM*",
    mother: "Ava Thompson",
    score: 10,
    interpretation: "Mild Anxiety",
    risk: "Medium",
    riskColor: "text-orange-500 bg-orange-50",
    interpColor: "text-orange-500",
  },
  {
    date: "25-07-11 ~3:45PM*",
    mother: "Liam Cooper",
    score: 10,
    interpretation: "Minimal Symptoms",
    risk: "None",
    riskColor: "text-green-500 bg-green-50",
    interpColor: "text-green-500",
  },
  {
    date: "25-07-11 ~3:45PM*",
    mother: "Mia Hughes",
    score: 10,
    interpretation: "Severe Depression",
    risk: "High",
    riskColor: "text-red-500 bg-red-50",
    interpColor: "text-red-500",
  },
  {
    date: "25-07-11 ~3:45PM*",
    mother: "Ethan Walker",
    score: 10,
    interpretation: "Minimal Anxiety",
    risk: "None",
    riskColor: "text-green-500 bg-green-50",
    interpColor: "text-green-500",
  },
  {
    date: "25-07-11 ~3:45PM*",
    mother: "Sophia Bennett",
    score: 10,
    interpretation: "Severe Depression",
    risk: "High",
    riskColor: "text-red-500 bg-red-50",
    interpColor: "text-red-500",
  },
];

function MentalHealthScreening() {
  const navigate = useNavigate();
  return (
    <div className="pt-6 min-h-screen">
      {/* Breadcrumbs and title */}
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
        <p className="text-(--primary-500) font-[600] text-[12px]">Mental health screening</p>
      </div>

      {/* title */}
      <div className="flex flex-col sm:flex-row sm:items-center py-4 sm:justify-between gap-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          Mental Health Screening
        </h2>
        <div className="flex items-center gap-2">
          <div className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="10" fill="#F87171" />
              <path
                d="M10 6v4"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="10" cy="14" r="1" fill="#fff" />
            </svg>
            3 High-Risk Screening Submissions
          </div>
          <span className="text-xs text-gray-400 hidden sm:inline">
            Click to view high-risk screenings
          </span>
        </div>
      </div>
      {/* Table card */}
      <div className="bg-white rounded-xl p-2 sm:p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div>
            <div className="font-semibold text-sm mb-1">
              All Healthcare Provider
            </div>
            <div className="text-xs text-gray-500">
              See all your Provider below
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <input
                className="w-full border rounded px-3 py-2 text-xs"
                placeholder="Search"
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
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Submission date
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Mother's Name
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Score
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Interpretation
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Risk Level
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {screenings.map((s, idx) => (
                <tr key={idx} className="border-t border-gray-100">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    {s.date}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    {s.mother}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    {s.score}
                  </td>
                  <td
                    className={`py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap font-semibold ${s.interpColor}`}
                  >
                    {s.interpretation}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${s.riskColor}`}
                    >
                      {s.risk}
                    </span>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    <button
                      className="bg-purple-600 text-white px-4 py-1 rounded-full text-xs w-full sm:w-auto transition hover:bg-purple-700"
                      onClick={() =>
                        navigate(`/admin/mental-health-screening/${idx}`)
                      }
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
    </div>
  );
}

export default MentalHealthScreening;
