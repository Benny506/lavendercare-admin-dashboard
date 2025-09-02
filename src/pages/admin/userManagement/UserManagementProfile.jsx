// Mock data
const patient = {
  name: "Chinenye Okeke",
  role: "Mother",
  status: "Active",
  age: 29,
  postpartum: 21,
  contact: "email@example.com",
  phone: "0801 234 5678",
  pregnancyStatus: "Postpartum",
};

const assignedProvider = {
  name: "Dr. Evelyn Reed",
  role: "Doctor",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
};

const timelineData = [
    {
      type: "Consultation",
      date: "07/15/2025, 2:00 PM",
      note: "Patient is experiencing mild anxiety...",
    },
    {
      type: "Booking made",
      date: "07/17/2025, 2:00 PM",
    },
    {
      type: "Screening Completed",
      date: "07/09/2025",
    },
    {
      type: "Prescription issued",
      date: "",
      note: "Sertraline, Dosage: 50mg",
    },
    {
      type: "Therapy Notes Added",
      date: "07/10/2024",
    },
    {
      type: "Consultation",
      date: "07/01/2024, 10:00 AM",
      note: "Initial assessment and treatment plan...",
    },
];

const bookingsData = [
    {
      service: "Medical Consultation",
      date: "Jul 15, 2025",
      time: "10:00 AM",
      status: "Accepted",
    },
    {
      service: "Therapy Session",
      date: "Jul 10, 2025",
      time: "2:00 PM",
      status: "Accepted",
    },
    {
      service: "Psychiatric Evaluation",
      date: "Jul 5, 2025",
      time: "11:30 AM",
      status: "Completed",
    },
    {
      service: "Medical Consultation",
      date: "Jun 28, 2025",
      time: "9:00 AM",
      status: "Completed",
    },
    {
      service: "Therapy Session",
      date: "Jun 20, 2025",
      time: "4:00 PM",
      status: "Declined",
    },
];

function UserManagementProfile() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col">
      
        {/* breadcrumbs */}
        <div className="flex py-[24px] items-center gap-1">
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
          <p className="text-(--primary-500) font-[600] text-[12px]">
            View all
          </p>
        </div>

        {/* Main grid */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Patient Info */}
          <div className="w-full md:w-1/3 bg-white rounded-xl p-4 md:p-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="avatar"
                className="w-20 h-20 rounded-full border-4 border-white"
              />
              <div className="flex flex-col items-center md:items-start">
                <span className="text-lg font-semibold">{patient.name}</span>
                <span className="text-gray-500 text-sm">{patient.role}</span>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded mt-1">
                  {patient.status}
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-sm text-gray-700">Patient Information</div>
              <div className="text-xs text-gray-500">Age: {patient.age}</div>
              <div className="text-xs text-gray-500">
                Postpartum Day: {patient.postpartum}
              </div>
              <div className="text-xs text-gray-500">
                Contact: {patient.contact}
              </div>
              <div className="text-xs text-gray-500">
                Phone: {patient.phone}
              </div>
              <div className="text-xs text-gray-500">
                Pregnancy Status: {patient.pregnancyStatus}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium mb-1">
                Session Summary & Notes
              </div>
              <textarea
                className="w-full border h-[87px] rounded p-2 text-xs"
                rows={2}
                placeholder="-"
                defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore at..."
              />
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium mb-1">
                Attachments & Reports
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Prescription Document</span>
                  <button className="bg-gray-100 px-2 py-1 rounded">
                    Download
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Test Results</span>
                  <button className="bg-gray-100 px-2 py-1 rounded">
                    View/Download
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Full Medical Report</span>
                  <button className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    Download Consolidated PDF
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button className="bg-red-100 text-red-700 px-4 py-2 rounded">
                Suspend
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded">
                Delete
              </button>
            </div>
          </div>

          {/* Right: Provider, Timeline, Bookings */}
          <div className="w-full md:w-2/3 flex flex-col gap-6">
            {/* Assigned Provider */}
            <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  Assigned Provider
                </div>
                {assignedProvider ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={assignedProvider.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{assignedProvider.name}</div>
                      <div className="text-xs text-gray-500">
                        {assignedProvider.role}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">-</div>
                )}
              </div>
              <button className="text-purple-600 text-xs font-medium">
                View
              </button>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-xl p-4 md:p-6">
              <div className="text-sm text-gray-500 mb-3">Status Timeline</div>
              {timelineData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                    <rect width="48" height="48" rx="12" fill="#F3F3F3" />
                    <path
                      d="M24 14V24L30 28"
                      stroke="#BDBDBD"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="12"
                      y="12"
                      width="24"
                      height="24"
                      rx="6"
                      stroke="#BDBDBD"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="text-gray-400 mt-2 font-medium">
                    No data to display
                  </div>
                  <div className="text-xs text-gray-400">
                    Recent appointments will appear here
                  </div>
                </div>
              ) : (
                <ol className="relative border-l border-gray-200 ml-4">
                  {timelineData.map((item, idx) => (
                    <li key={idx} className="mb-8 ml-4">
                      <div className="absolute w-3 h-3 bg-purple-200 rounded-full -left-6 border-2 border-white"></div>
                      <div className="font-medium text-sm">
                        {item.type}{" "}
                        {item.date && (
                          <span className="text-xs text-gray-400 font-normal ml-1">
                            - {item.date}
                          </span>
                        )}
                      </div>
                      {item.note && (
                        <div className="text-xs text-gray-500 mt-1">
                          Note: {item.note}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Past Bookings */}
            <div className="bg-white rounded-xl p-4 md:p-6">
              <div className="text-sm text-gray-500 mb-3">Past Bookings</div>
              {bookingsData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                    <rect width="48" height="48" rx="12" fill="#F3F3F3" />
                    <path
                      d="M24 14V24L30 28"
                      stroke="#BDBDBD"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="12"
                      y="12"
                      width="24"
                      height="24"
                      rx="6"
                      stroke="#BDBDBD"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="text-gray-400 mt-2 font-medium">
                    No data to display
                  </div>
                  <div className="text-xs text-gray-400">
                    Recent appointments will appear here
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs md:text-sm">
                    <thead>
                      <tr className="text-left text-gray-400">
                        <th className="py-2 pr-4">Services</th>
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Time</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingsData.map((b, idx) => (
                        <tr key={idx} className="border-t border-gray-100">
                          <td className="py-2 pr-4 font-medium">{b.service}</td>
                          <td className="py-2 pr-4">{b.date}</td>
                          <td className="py-2 pr-4">{b.time}</td>
                          <td className="py-2 pr-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                b.status === "Accepted"
                                  ? "bg-green-100 text-green-700"
                                  : b.status === "Completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="py-2 pr-4">
                            <button className="bg-purple-100 text-purple-700 px-3 py-1 rounded">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagementProfile;
