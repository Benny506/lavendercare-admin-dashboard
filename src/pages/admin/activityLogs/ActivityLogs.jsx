const logs = [
  {
    date: "25-07-11 ~3:45PM*",
    user: "Dr. Grace Bello",
    activity: "Consultation Attended",
  },
  {
    date: "25-07-11 ~3:45PM*",
    user: "Emeka Obi",
    activity: "Screening submitted",
  },
  {
    date: "25-07-11 ~3:45PM*",
    user: "Lillian James",
    activity: "Booking done",
  },
  {
    date: "25-07-11 ~3:45PM*",
    user: "Dr. David Okoria",
    activity: "Follow up message",
  },
  {
    date: "25-07-11 ~3:45PM*",
    user: "Doula Funke Adeyemi",
    activity: "Account Created",
  },
  {
    date: "25-07-11 ~3:45PM*",
    user: "Therapist Aisha Lawal",
    activity: "Upload document",
  },
  {
    date: "25-07-11 ~3:45PM*",
    user: "Dr. Chuka Nwosu",
    activity: "Logged in",
  },
];

function ActivityLogs() {
  return (
    <div className="pb-[30px]">
      {/* breadcrumb */}
      <div className="flex py-[24px] pb-[24px] items-center gap-1">
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
        <p className="text-[12px]">User management</p>
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
          Invite Users
        </p>
      </div>

      <div className="flex items-center justify-between pb-5">
        <h2 className="text-xl sm:text-2xl font-bold">Activity Logs</h2>

        {/* last 30days and filter by button */}
        <div className="flex flex-wrap w-max gap-2 justify-end">
          <button className="bg-white px-2  flex items-center gap-3 sm:px-3 py-2 rounded-[6px] border border-gray-200">
            Last 30 days{" "}
            <svg
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.351472 0.751862C0.820101 0.283233 1.5799 0.283233 2.04853 0.751863L8 6.70334L13.9515 0.751864C14.4201 0.283235 15.1799 0.283235 15.6485 0.751864C16.1172 1.22049 16.1172 1.98029 15.6485 2.44892L8.84853 9.24892C8.62348 9.47396 8.31826 9.60039 8 9.60039C7.68174 9.60039 7.37651 9.47396 7.15147 9.24892L0.351472 2.44892C-0.117157 1.98029 -0.117157 1.22049 0.351472 0.751862Z"
                fill="black"
                fill-opacity="0.5"
              />
            </svg>
          </button>
          <button className="bg-white px-2 flex items-center gap-3  sm:px-3 py-2 rounded-[6px] border border-gray-200">
            Filter by: All{" "}
            <svg
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.351472 0.751862C0.820101 0.283233 1.5799 0.283233 2.04853 0.751863L8 6.70334L13.9515 0.751864C14.4201 0.283235 15.1799 0.283235 15.6485 0.751864C16.1172 1.22049 16.1172 1.98029 15.6485 2.44892L8.84853 9.24892C8.62348 9.47396 8.31826 9.60039 8 9.60039C7.68174 9.60039 7.37651 9.47396 7.15147 9.24892L0.351472 2.44892C-0.117157 1.98029 -0.117157 1.22049 0.351472 0.751862Z"
                fill="black"
                fill-opacity="0.5"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full sm:text-sm">
          <thead className="bg-white">
            <tr>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                Date
              </th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                User
              </th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                Activity
              </th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {logs.map((log, idx) => (
              <tr key={idx} className="border-t border-gray-100">
                <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                  {log.date}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                  {log.user}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                  {log.activity}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 flex gap-2">
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
  );
}

export default ActivityLogs;
