const providers = [
  {
    name: "Dr. Grace Bello",
    specialty: "OB-GYN",
    hospital: "City General Hospital",
    consults: 132,
    rating: 3.2,
    status: true,
  },
  {
    name: "Dr. Emeka Obi",
    specialty: "Maternal Mental Health",
    hospital: "Metro Heart Center",
    consults: 98,
    rating: 4.2,
    status: true,
  },
  {
    name: "Nurse Lillian James",
    specialty: "Postnatal Recovery",
    hospital: "PSkin & Wellness Clinic",
    consults: 76,
    rating: 4.5,
    status: true,
  },
  {
    name: "Dr. David Okorie",
    specialty: "General Practitioner",
    hospital: "Cancer Care Center",
    consults: 121,
    rating: 4.4,
    status: true,
  },
  {
    name: "Doula Funke Adeyemi",
    specialty: "Birth & Labor Support",
    hospital: "Joint & Motion Clinic",
    consults: 65,
    rating: 2.2,
    status: false,
  },
  {
    name: "Therapist Aisha Lawal",
    specialty: "Postpartum Therapy",
    hospital: "Mental Health Associates",
    consults: 89,
    rating: 4.5,
    status: true,
  },
  {
    name: "Dr. Chuka Nwosu",
    specialty: "Pelvic Health Specialist",
    hospital: "Women's Health Center",
    consults: 54,
    rating: 4.5,
    status: true,
  },
];

function HealthcareProvider() {
  return (
    <div className=" pt-6 min-h-screen">
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
        <p className="text-(--primary-500) font-[600] text-[12px]">View all</p>
      </div>

      {/* healthcare provider title */}
      <div className="flex justify-between py-4 items-center">
        <h2 className="text-xl sm:text-2xl font-bold">
          Healthcare Provider
        </h2>

        <div className="text-xs w-max text-gray-500 flex gap-2 bg-white py-3 px-4 rounded-sm items-center">
          <svg
            width="18"
            height="14"
            viewBox="0 0 18 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 10.6919L9 5.1534M9 5.1534L11.4615 7.61493M9 5.1534L6.53846 7.61493M4.69231 13.1534C2.6531 13.1534 1 11.5003 1 9.46109C1 7.82585 2.06302 6.43889 3.53571 5.95355C3.48701 5.69428 3.46154 5.42681 3.46154 5.1534C3.46154 2.77432 5.39016 0.845703 7.76923 0.845703C9.76409 0.845703 11.4422 2.20168 11.9322 4.04221C12.1716 3.96458 12.4271 3.92263 12.6923 3.92263C14.0518 3.92263 15.1538 5.02469 15.1538 6.38416C15.1538 6.66982 15.1052 6.94411 15.0157 7.1992C16.1757 7.63992 17 8.76193 17 10.0765C17 11.7758 15.6224 13.1534 13.9231 13.1534H4.69231Z"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Export
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 flex flex-col items-start min-w-[120px]">
          <span className="text-xs text-gray-500 mb-1">Total Providers</span>
          <span className="text-3xl font-bold">424</span>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col items-start min-w-[120px]">
          <span className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_922_25372)">
                <path
                  d="M19.6665 5.5V19.5H5.6665V5.5H19.6665ZM19.6665 3.5H5.6665C4.5565 3.5 3.6665 4.4 3.6665 5.5V19.5C3.6665 20.6 4.5565 21.5 5.6665 21.5H19.6665C20.7665 21.5 21.6665 20.6 21.6665 19.5V5.5C21.6665 4.4 20.7665 3.5 19.6665 3.5ZM12.6665 12.5C11.0165 12.5 9.6665 11.15 9.6665 9.5C9.6665 7.85 11.0165 6.5 12.6665 6.5C14.3165 6.5 15.6665 7.85 15.6665 9.5C15.6665 11.15 14.3165 12.5 12.6665 12.5ZM12.6665 8.5C12.1165 8.5 11.6665 8.95 11.6665 9.5C11.6665 10.05 12.1165 10.5 12.6665 10.5C13.2165 10.5 13.6665 10.05 13.6665 9.5C13.6665 8.95 13.2165 8.5 12.6665 8.5ZM18.6665 18.5H6.6665V16.97C6.6665 14.47 10.6365 13.39 12.6665 13.39C14.6965 13.39 18.6665 14.47 18.6665 16.97V18.5ZM8.9765 16.5H16.3565C15.6665 15.94 13.9765 15.38 12.6665 15.38C11.3565 15.38 9.6565 15.94 8.9765 16.5Z"
                  fill="#669F2A"
                />
              </g>
              <defs>
                <clipPath id="clip0_922_25372">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0.666504 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
            Active
          </span>
          <span className="text-3xl font-bold">400</span>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col items-start min-w-[120px]">
          <span className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_922_25382)">
                <path
                  d="M19.3335 5.5V19.5H5.3335V5.5H19.3335ZM19.3335 3.5H5.3335C4.2235 3.5 3.3335 4.4 3.3335 5.5V19.5C3.3335 20.6 4.2235 21.5 5.3335 21.5H19.3335C20.4335 21.5 21.3335 20.6 21.3335 19.5V5.5C21.3335 4.4 20.4335 3.5 19.3335 3.5ZM12.3335 12.5C10.6835 12.5 9.3335 11.15 9.3335 9.5C9.3335 7.85 10.6835 6.5 12.3335 6.5C13.9835 6.5 15.3335 7.85 15.3335 9.5C15.3335 11.15 13.9835 12.5 12.3335 12.5ZM12.3335 8.5C11.7835 8.5 11.3335 8.95 11.3335 9.5C11.3335 10.05 11.7835 10.5 12.3335 10.5C12.8835 10.5 13.3335 10.05 13.3335 9.5C13.3335 8.95 12.8835 8.5 12.3335 8.5ZM18.3335 18.5H6.3335V16.97C6.3335 14.47 10.3035 13.39 12.3335 13.39C14.3635 13.39 18.3335 14.47 18.3335 16.97V18.5ZM8.6435 16.5H16.0235C15.3335 15.94 13.6435 15.38 12.3335 15.38C11.0235 15.38 9.3235 15.94 8.6435 16.5Z"
                  fill="#8B8B8A"
                />
              </g>
              <defs>
                <clipPath id="clip0_922_25382">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0.333496 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
            Inactive
          </span>
          <span className="text-3xl font-bold">23</span>
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
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs"
                placeholder="Search"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <circle cx="7" cy="7" r="5.5" stroke="#BDBDBD" />
                  <path d="M11 11l3 3" stroke="#BDBDBD" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <button className="border-gray-300 bg-white border px-2 sm:px-3 py-2 rounded text-xs">
              Filter by: All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Name
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Specialty
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Hospital
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Total Consults
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Rating
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Status
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p, idx) => (
                <tr key={p.name} className="border-t border-gray-100">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    {p.name}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    {p.specialty}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    {p.hospital}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    {p.consults}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap flex items-center gap-1">
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path
                        d="M8 1.333l2.06 4.175 4.607.669-3.334 3.25.787 4.586L8 11.667l-4.12 2.046.787-4.586-3.334-3.25 4.607-.669L8 1.333z"
                        fill="#FACC15"
                      />
                    </svg>
                    {p.rating}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={p.status}
                        readOnly
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 transition-colors"></div>
                      <div className="absolute w-4 h-4 bg-white border rounded-full left-1 top-0.5 peer-checked:translate-x-4 transition-transform"></div>
                    </label>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap flex gap-2">
                    <button className="text-purple-600 hover:underline">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.0514 3.73889L15.4576 2.33265C16.0678 1.72245 17.0572 1.72245 17.6674 2.33265C18.2775 2.94284 18.2775 3.93216 17.6674 4.54235L8.81849 13.3912C8.37792 13.8318 7.83453 14.1556 7.23741 14.3335L5 15L5.66648 12.7626C5.84435 12.1655 6.1682 11.6221 6.60877 11.1815L14.0514 3.73889ZM14.0514 3.73889L16.25 5.93749M15 11.6667V15.625C15 16.6605 14.1605 17.5 13.125 17.5H4.375C3.33947 17.5 2.5 16.6605 2.5 15.625V6.87499C2.5 5.83946 3.33947 4.99999 4.375 4.99999H8.33333"
                          stroke="#6F3DCB"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                    <button className="text-purple-600 hover:underline">
                      <svg
                        width="18"
                        height="12"
                        viewBox="0 0 18 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.9483 5.757C17.922 5.69775 17.2868 4.2885 15.8745 2.87625C13.9928 0.9945 11.616 0 9 0C6.384 0 4.00725 0.9945 2.12549 2.87625C0.713243 4.2885 0.0749929 5.7 0.0517429 5.757C0.0176277 5.83373 0 5.91677 0 6.00075C0 6.08473 0.0176277 6.16777 0.0517429 6.2445C0.0779929 6.30375 0.713243 7.71225 2.12549 9.1245C4.00725 11.0055 6.384 12 9 12C11.616 12 13.9928 11.0055 15.8745 9.1245C17.2868 7.71225 17.922 6.30375 17.9483 6.2445C17.9824 6.16777 18 6.08473 18 6.00075C18 5.91677 17.9824 5.83373 17.9483 5.757ZM9 10.8C6.6915 10.8 4.67475 9.96075 3.00524 8.30625C2.32023 7.62502 1.73743 6.84822 1.27499 6C1.73731 5.1517 2.32012 4.37488 3.00524 3.69375C4.67475 2.03925 6.6915 1.2 9 1.2C11.3085 1.2 13.3253 2.03925 14.9948 3.69375C15.6811 4.37472 16.2652 5.15154 16.7288 6C16.188 7.0095 13.8323 10.8 9 10.8ZM9 2.4C8.28799 2.4 7.59196 2.61114 6.99995 3.00671C6.40793 3.40228 5.94651 3.96453 5.67403 4.62234C5.40156 5.28015 5.33026 6.00399 5.46917 6.70233C5.60808 7.40066 5.95094 8.04212 6.45441 8.54559C6.95788 9.04906 7.59934 9.39192 8.29767 9.53083C8.99601 9.66973 9.71985 9.59844 10.3777 9.32597C11.0355 9.05349 11.5977 8.59207 11.9933 8.00005C12.3889 7.40804 12.6 6.71201 12.6 6C12.599 5.04553 12.2194 4.13043 11.5445 3.45551C10.8696 2.7806 9.95448 2.40099 9 2.4ZM9 8.4C8.52532 8.4 8.06131 8.25924 7.66663 7.99553C7.27195 7.73181 6.96434 7.35698 6.78269 6.91844C6.60104 6.4799 6.55351 5.99734 6.64611 5.53178C6.73872 5.06623 6.9673 4.63859 7.30294 4.30294C7.63859 3.9673 8.06623 3.73872 8.53178 3.64612C8.99734 3.55351 9.4799 3.60104 9.91844 3.78269C10.357 3.96434 10.7318 4.27195 10.9955 4.66663C11.2592 5.06131 11.4 5.52532 11.4 6C11.4 6.63652 11.1471 7.24697 10.6971 7.69706C10.247 8.14714 9.63652 8.4 9 8.4Z"
                          fill="#6F3DCB"
                        />
                      </svg>
                    </button>
                    <button className="text-red-500 hover:underline">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.2837 7.5L11.9952 15M8.00481 15L7.71635 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.875 4.96358M16.023 4.82547L15.1332 16.3938C15.058 17.3707 14.2434 18.125 13.2637 18.125H6.73631C5.75655 18.125 4.94198 17.3707 4.86683 16.3938L3.97696 4.82547M16.023 4.82547C15.0677 4.6812 14.1013 4.57071 13.125 4.49527M3.125 4.96358C3.40798 4.91456 3.69198 4.86851 3.97696 4.82547M3.97696 4.82547C4.93231 4.6812 5.89874 4.57071 6.875 4.49527M13.125 4.49527V3.73182C13.125 2.74902 12.3661 1.92853 11.3838 1.8971C10.9244 1.8824 10.463 1.875 10 1.875C9.53696 1.875 9.07565 1.8824 8.61618 1.8971C7.63388 1.92853 6.875 2.74902 6.875 3.73182V4.49527M13.125 4.49527C12.0938 4.41558 11.0516 4.375 10 4.375C8.94836 4.375 7.9062 4.41558 6.875 4.49527"
                          stroke="#E41C11"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
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

export default HealthcareProvider;
