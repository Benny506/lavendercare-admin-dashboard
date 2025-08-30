import React, { useState } from "react";

const bookings = [
  {
    date: "23-08-23 / 03:00 - 4:00PM",
    mother: "Sophia Bennett",
    care: "Medical Consultation",
    status: "Upcoming",
  },
  {
    date: "23-08-23 / 03:00 - 4:00PM",
    mother: "Ethan Walker",
    care: "Mental Health Support",
    status: "Ongoing",
  },
  {
    date: "23-08-23 / 03:00 - 4:00PM",
    mother: "Ava Thompson",
    care: "Medical Consultation",
    status: "Attended",
  },
  {
    date: "23-08-23 / 03:00 - 4:00PM",
    mother: "Liam Cooper",
    care: "Mental Health Support",
    status: "Attended",
  },
  {
    date: "23-08-23 / 03:00 - 4:00PM",
    mother: "Mia Hughes",
    care: "Physical Recovery",
    status: "Attended",
  },
  {
    date: "23-08-23 / 03:00 - 4:00PM",
    mother: "Liam Cooper",
    care: "Mental Health Support",
    status: "Cancelled",
  },
  {
    date: "23-08-23 / 03:00 - 4:00PM",
    mother: "Ethan Walker",
    care: "Physical Recovery",
    status: "Missed",
  },
];

const reviews = [
  {
    date: "12/08/2025",
    name: "Hope O.",
    stars: 5,
    care: "Medical Consultation",
    text: "This is a review of the product. This review will have a character limit. The date I propose This review will have a character limit.",
  },
  {
    date: "08/08/2025",
    name: "Hope O.",
    stars: 2,
    care: "Medical Consultation",
    text: "This is a review of the product. This review will have a character limit. The date I propose This review will have a character limit.",
  },
  {
    date: "12/07/2024",
    name: "Hope O.",
    stars: 5,
    care: "Colour BLUE",
    text: "This is a review of the product. This review will have a character limit. The date I propose This review will have a character limit.",
  },
];

function HealthcareDetail() {
  const [showSuspend, setShowSuspend] = useState(false);

  return (
    <div className=" bg-[#F8F9FB] min-h-screen">
      {/* breadcrumb  */}
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
        <p className="text-[12px]">Healthcare providers</p>
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

      <div className="grid grid-cols-1 relative md:grid-cols-3 gap-6">
        {/* Left: Doctor Info */}
        <div className="bg-white rounded-xl p-4 flex flex-col gap-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="avatar"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <div className="font-semibold text-lg">Dr Grace Bello</div>
              <div className="text-xs text-gray-500">OB-GYN</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-[18px] mb-2">Doctor Info</div>
            <div className="text-xs flex items-center gap-1 pb-3 text-gray-500">
              <svg
                width="14"
                height="15"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 4.26923C1 9.36724 5.13276 13.5 10.2308 13.5H11.6154C12.3801 13.5 13 12.8801 13 12.1154V11.2713C13 10.9536 12.7838 10.6767 12.4756 10.5997L9.75364 9.91918C9.48341 9.85162 9.19901 9.9526 9.03189 10.1754L8.43483 10.9715C8.26155 11.2025 7.96185 11.3047 7.69067 11.2054C5.65563 10.4599 4.0401 8.84437 3.29462 6.80933C3.19529 6.53815 3.29745 6.23845 3.52849 6.06517L4.32457 5.46811C4.5474 5.30099 4.64838 5.01659 4.58082 4.74636L3.90033 2.0244C3.82328 1.71621 3.54637 1.5 3.22869 1.5H2.38462C1.61991 1.5 1 2.11991 1 2.88462V4.26923Z"
                  stroke="black"
                  stroke-opacity="0.5"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              +234800081728
            </div>
            <div className="text-xs flex items-center gap-1 text-gray-500">
              <svg
                width="14"
                height="13"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 3V10C13 10.8284 12.3801 11.5 11.6154 11.5H2.38462C1.61991 11.5 1 10.8284 1 10V3M13 3C13 2.17157 12.3801 1.5 11.6154 1.5H2.38462C1.61991 1.5 1 2.17157 1 3M13 3V3.16181C13 3.6827 12.7506 4.1663 12.3411 4.43929L7.72567 7.51622C7.28065 7.8129 6.71935 7.8129 6.27433 7.51622L1.65894 4.43929C1.24945 4.1663 1 3.6827 1 3.16181V3"
                  stroke="black"
                  stroke-opacity="0.5"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Hazelnutt@gmail.com
            </div>
          </div>

          {/* pricing */}
          <div className="py-5 border-y  border-gray-300">
            <div className="font-semibold text-sm mb-1 text-[18px] pb-1">
              Pricing
            </div>
            <div className=" pb-2 text-gray-600">
              Type:{" "}
              <span className="text-black text-sm border-2 border-black rounded-full py-[2px] px-3">
                Fixed
              </span>
            </div>
            <div className=" pb-2 text-gray-600">
              Price/Session:{" "}
              <span className="font-semibold text-black">#1200</span>
            </div>
            <div className=" text-gray-600">
              Session Duration:{" "}
              <span className="font-semibold text-black">2hrs</span>
            </div>
          </div>

          {/* credentials */}
          <div>
            <div className="text-[18px] font-semibold mb-3">Credentials</div>
            <div className="text-gray-500 mb-6">License No: 0123456789</div>

            {/* review section */}
            <div className="flex justify-between rounded-sm gap-1 bg-(--primary-50) h-[96px] p-4 mt-2">
              <div className="flex-col flex">
                <a href="#" className="text-xs w-[120px] text-purple-600  ">
                  Tech design requirements.pdf
                </a>
                <a href="#" className="text-xs text-purple-600  ">
                  Review
                </a>
              </div>

              <div>
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.3333 12.9993V12.3327C21.3333 11.3993 21.3333 10.9326 21.1517 10.576C20.9919 10.2624 20.7369 10.0075 20.4233 9.84767C20.0668 9.66602 19.6001 9.66602 18.6667 9.66602H17.3333C16.3999 9.66602 15.9332 9.66602 15.5767 9.84767C15.2631 10.0075 15.0081 10.2624 14.8483 10.576C14.6667 10.9326 14.6667 11.3993 14.6667 12.3327V12.9993M16.3333 17.5827V21.7493M19.6667 17.5827V21.7493M10.5 12.9993H25.5M23.8333 12.9993V22.3327C23.8333 23.7328 23.8333 24.4329 23.5608 24.9677C23.3212 25.4381 22.9387 25.8205 22.4683 26.0602C21.9335 26.3327 21.2335 26.3327 19.8333 26.3327H16.1667C14.7665 26.3327 14.0665 26.3327 13.5317 26.0602C13.0613 25.8205 12.6788 25.4381 12.4392 24.9677C12.1667 24.4329 12.1667 23.7328 12.1667 22.3327V12.9993"
                    stroke="#E41C11"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* availabilty section */}
          <div className="flex items-center justify-between">
            <div className="font-medium text-[18px] text-sm">Availability</div>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_924_69368)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M23.773 20.398L18.148 26.023C17.9282 26.2428 17.5718 26.2428 17.352 26.023C17.1322 25.8032 17.1322 25.4468 17.352 25.227L22.5798 20L17.352 14.773C17.1322 14.5532 17.1322 14.1968 17.352 13.977C17.5718 13.7572 17.9282 13.7572 18.148 13.977L23.773 19.602C23.8786 19.7075 23.9379 19.8507 23.9379 20C23.9379 20.1493 23.8786 20.2925 23.773 20.398Z"
                  fill="#1C0D14"
                />
              </g>
              <defs>
                <clipPath id="clip0_924_69368">
                  <rect
                    width="18"
                    height="18"
                    fill="white"
                    transform="translate(11 11)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>

          <div className="flex justify-between gap-2 mt-2">
            <button
              className="bg-red-100 w-full hover:cursor-pointer text-red-700 px-4 py-2 rounded"
              onClick={() => setShowSuspend(true)}
            >
              Suspend
            </button>
            <button className="bg-red-600 w-full hover:cursor-pointer text-white px-4 py-2 rounded">
              Delete
            </button>
          </div>
        </div>

        {/* Right: Bookings and Reviews */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            {/* recent bookings header */}
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold text-sm">Recent Bookings</div>
              <a
                href="#"
                className="text-xs flex items-center gap-1 text-purple-600 font-semibold"
              >
                View all Consultation
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_2155_18328)">
                    <path
                      d="M10.0002 3.33398L8.82516 4.50898L13.4752 9.16732H3.3335V10.834H13.4752L8.82516 15.4923L10.0002 16.6673L16.6668 10.0007L10.0002 3.33398Z"
                      fill="#6F3DCB"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2155_18328">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
            </div>

            {/* recent booking table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="min-w-full text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                      Consultation Date
                    </th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                      Mother Name
                    </th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                      Care type
                    </th>
                    <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, idx) => (
                    <tr key={idx} className="border-t border-gray-100">
                      <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                        {b.date}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                        {b.mother}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                        {b.care}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            b.status === "Upcoming"
                              ? "bg-orange-100 text-orange-600"
                              : b.status === "Ongoing"
                              ? "bg-green-100 text-green-600"
                              : b.status === "Attended"
                              ? "bg-blue-100 text-blue-600"
                              : b.status === "Cancelled"
                              ? "bg-gray-100 text-gray-400"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {b.status}
                        </span>
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

          {/* Customer Review */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div className="font-semibold text-sm">
                Customer Review{" "}
                <span className="text-xs text-gray-400">(12 Reviews)</span>
              </div>
              <div className="flex gap-2 items-center">
                <button className="bg-gray-100 px-2 sm:px-3 py-2 rounded text-xs">
                  Sort by: 5 stars
                </button>
                <span className="text-xs text-gray-400">12 Reviews</span>
                <span className="text-2xl font-bold">4.5/5</span>
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path
                    d="M10 1.667l2.575 5.225 5.775.84-4.175 4.075.985 5.75L10 14.417l-5.16 2.84.985-5.75-4.175-4.075 5.775-.84L10 1.667z"
                    fill="#FACC15"
                  />
                </svg>
              </div>
            </div>
            <div className="divide-y">
              {reviews.map((r, idx) => (
                <div key={idx} className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                    <div className="flex gap-2 items-center">
                      <span className="font-semibold text-sm">{r.name}</span>
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      {[...Array(r.stars)].map((_, i) => (
                        <svg
                          key={i}
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M8 1.333l2.06 4.175 4.607.669-3.334 3.25.787 4.586L8 11.667l-4.12 2.046.787-4.586-3.334-3.25 4.607-.669L8 1.333z"
                            fill="#FACC15"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    Care type: {r.care}
                  </div>
                  <div className="text-xs text-gray-500">{r.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suspend Modal */}
      {showSuspend && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center cursor-pointer bg-black/80" onClick={() => setShowSuspend(false)}>
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="font-semibold text-lg">Suspend Provider</div>
              <button
                className="text-gray-400 hover:cursor-pointer text-xl"
                onClick={() => setShowSuspend(false)}
              >
                &times;
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-6">
              Are you sure you want to suspend this Provider?
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-100 hover:cursor-pointer px-4 py-2 rounded"
                onClick={() => setShowSuspend(false)}
              >
                Cancel
              </button>
              <button className="bg-red-600 hover:cursor-pointer text-white px-4 py-2 rounded">
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthcareDetail;
