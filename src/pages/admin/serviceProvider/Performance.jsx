import React from "react";

function Performance() {
  return (
    <div className=" pt-6 min-h-screen">
      {/* Breadcrumbs */}
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
        <p className="text-(--primary-500) font-[600] text-[12px]">Performance</p>
      </div>

      {/* service provider header */}
      <div className="flex flex-col gap-4 md:flex-row items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          Service Providers Performance
        </h2>

        {/* Filters */}
        <div className="flex w-max flex-wrap gap-2 justify-end">
          <select className="border-gray-300 border bg-white px-2 sm:px-3 py-2 rounded text-xs">
            <option>Provider</option>
          </select>
          <select className="border-gray-300 border bg-white px-2 sm:px-3 py-2 rounded text-xs">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
          <button className="border-gray-300 border bg-white flex items-center gap-2 px-2 sm:px-3 py-2 rounded text-xs">
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
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 flex flex-col items-start min-w-[150px]">
          <span className="text-xs text-gray-500 mb-1">Avg Rating</span>
          <span className="text-3xl font-bold">4.8</span>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col items-start min-w-[150px]">
          <span className="text-xs text-gray-500 mb-1">Response Rate</span>
          <span className="text-3xl font-bold">95%</span>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col items-start min-w-[150px]">
          <span className="text-xs text-gray-500 mb-1">
            Appointments Delivered
          </span>
          <span className="text-3xl font-bold">1250</span>
        </div>
      </div>

      {/* Appointments Trend */}
      <div className="bg-white rounded-[16px] mb-6">
        <h2 className="font-semibold text-[21px] pt-5 pl-4">
          Appointments Trend
        </h2>

        <div className="grid grid-cols-1 p-4 md:grid-cols-2 gap-4">
          {/* Appointments Over Time */}
          <div className="bg-white border border-gray-300 rounded-xl p-4 flex flex-col min-h-[300px] h-[300px] md:h-[350px]">
            <div className="font-semibold">Appointments Over Time</div>
            <div className="text-[32px] font-bold">1,250</div>
            <div className="text-xs text-gray-400 flex items-center gap-2">
              Last 30 Days{" "}
              <span className="bg-(--success) text-(--success_text) py-[2px] px-[8px] rounded-full flex items-center font-semibold">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6"
                    stroke="#669F2A"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                20%
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              {/* Chart Placeholder */}
              <div className="w-full h-32 sm:h-40 md:h-48 bg-purple-50 rounded-lg flex items-center justify-center text-purple-200 text-lg font-bold">
                Chart
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white border border-gray-300 rounded-xl p-4 flex flex-col min-h-[300px] h-[300px] md:h-[350px]">
            <div className="font-semibold mb-1">Rating Distribution</div>
            <div className="text-[32px] font-bold">4.8</div>
            <div className="text-xs text-gray-400 mb-2 flex gap-2 items-center">
              Last 30 Days{" "}
              <span className="bg-(--error) flex w-max items-center  py-[2px] px-[8px] rounded-full text-(--error-700) font-semibold">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 2.5V9.5M6 9.5L9.5 6M6 9.5L2.5 6"
                    stroke="#F04438"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                20%
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              {/* Chart Placeholder */}
              <div className="w-full h-32 sm:h-40 md:h-48 bg-purple-50 rounded-lg flex items-center justify-center text-purple-200 text-lg font-bold">
                Chart
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Performance;
