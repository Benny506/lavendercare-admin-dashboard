import React from "react";

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

function AllCaseload() {
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

      <div className="bg-white mt-6 rounded-lg">
        {/* title */}
        <div className="flex flex-col px-4 md:flex-row md:items-center py-4 md:justify-between mb-4 gap-2">
          <div>
            <h3 className="font-bold text-xl">All Caseload</h3>
            <p className="text-gray-500 text-sm">See all your caseload below</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search doctor or mother"
              className="w-full md:w-64 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary-200)"
            />
            <select className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700">
              <option>Filter by: All</option>
              <option>Open</option>
              <option>Closed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 text-left font-medium">
                  Mother's Name
                </th>
                <th className="py-2 px-4 text-left font-medium">
                  Assigned Doctor
                </th>
                <th className="py-2 px-4 text-left font-medium">Care Type</th>
                <th className="py-2 px-4 text-left font-medium">
                  Last Consult Date
                </th>
                <th className="py-2 px-4 text-left font-medium">Status</th>
                <th className="py-2 px-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {caseloadData.map((c, idx) => (
                <tr
                  key={c.mother}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="py-2 px-4">{c.mother}</td>
                  <td className="py-2 px-4">{c.doctor}</td>
                  <td className="py-2 px-4">{c.careType}</td>
                  <td className="py-2 px-4">{c.lastConsult}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        c.status === "Open"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <button className="bg-(--primary-100) text-(--primary-500) hover:bg-(--primary-200) rounded-lg px-3 py-1 font-medium transition">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center py-3 px-6 mt-4">
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

export default AllCaseload;
