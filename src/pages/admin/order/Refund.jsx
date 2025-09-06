import React, { useEffect, useState } from "react";

const refundData = [
  {
    id: "#10023",
    user: "Dr. Emeka Obi",
    amount: "₦5,200",
    reason: "Item not as described",
  },
  {
    id: "#10023",
    user: "Dr. Emeka Obi",
    amount: "₦3,800",
    reason: "Damaged during shipping",
  },
  {
    id: "#10023",
    user: "Nurse Lillian James",
    amount: "₦7,500",
    reason: "Wrong item received",
  },
  {
    id: "#10028",
    user: "Duola Funke Adeyemi",
    amount: "₦2,900",
    reason: "Changed mind",
  },
  {
    id: "#10023",
    user: "Dr. Emeka Obi",
    amount: "₦4,500",
    reason: "Late delivery",
  },
];

function Refund() {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleProcess = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  useEffect(()=>{
        showModal ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto'
  }, [showModal])

  return (
    <div className="pt-6 w-full min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
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
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_1918_35894)">
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
        <span>Orders & Transactions</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_1918_35894)">
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
        <span className="text-(--primary-500) font-semibold">Refunds</span>
      </div>



      <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
        Refund Requests
      </h2>
      <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">
        Process cancellation & refunds
      </p>
      <div className="bg-white rounded-xl shadow-sm p-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3 sm:mb-4">
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm bg-white text-gray-700 w-full md:w-auto max-w-[160px] focus:outline-none">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>All time</option>
          </select>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search doctor or mother"
              className="border border-gray-200 rounded-lg px-3 py-2 w-full md:w-64 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50 whitespace-nowrap">
              Filter by: All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Order ID
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  User
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Amount Requested
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Reason
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {refundData.map((order, idx) => (
                <tr key={idx}>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {order.id}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {order.user}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {order.amount}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {order.reason}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap flex gap-2 items-center">
                    <button
                      className="text-primary font-medium text-xs sm:text-sm border border-primary rounded px-3 py-1"
                      onClick={() => handleProcess(order)}
                    >
                      Process
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 gap-2 mt-2">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-0 cursor-pointer">
            Previous
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-primary text-white text-xs sm:text-sm">
              1
            </button>
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">
              2
            </button>
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">
              3
            </button>
            <span className="text-gray-400">...</span>
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">
              10
            </button>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 cursor-pointer">
            Next
          </div>
        </div>
      </div>


      {/* Modal Popup for Process */}
      {showModal && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/80 bg-opacity-30">
          <div className="bg-white h-[540px] xl:h-auto overflow-y-auto border-(--primary-500)/30 border-8 rounded-xl shadow-lg p-2 md:p-6 w-[90%] max-w-md relative animate-fadeIn">
            {/* back button */}
            <button
              className="absolute flex items-center gap-1 font-semibold text-(--primary-500) left-4 top-4 text-primary"
              onClick={() => setShowModal(false)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_2298_800)">
                  <path
                    d="M16.6668 9.16634H6.52516L11.1835 4.50801L10.0002 3.33301L3.3335 9.99967L10.0002 16.6663L11.1752 15.4913L6.52516 10.833H16.6668V9.16634Z"
                    fill="#6F3DCB"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2298_800">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Back
            </button>

            <div className="flex flex-col items-center mb-4">
              <div className="bg-[#F1ECFA] mt-12 rounded-full p-3 mb-2">
                <svg
                  width="33"
                  height="30"
                  viewBox="0 0 44 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_1544_38275)">
                    <path
                      d="M26.6755 0H28.476C28.5995 0.0378276 28.7485 0.0515235 28.8793 0.0628907C29.5825 0.123933 30.28 0.254278 30.9598 0.433622C34.0723 1.26494 36.689 3.19473 38.2255 5.79205C39.1332 7.3273 39.6217 9.03844 39.6498 10.7812C40.5244 10.9049 41.5395 10.8873 42.3762 11.0888C43.0721 11.2565 43.7119 11.9825 43.7675 12.6248C43.8179 13.0991 43.7951 13.6365 43.795 14.1201L43.7942 16.8153L43.7941 20.1345C43.7941 20.8291 43.8302 21.7264 43.714 22.3918C43.4451 23.9478 42.5028 25.3413 41.0971 26.2619C40.2729 26.8061 39.3193 27.1661 38.3136 27.3125C37.5357 27.4222 36.5538 27.3913 35.7486 27.3912L32.1475 27.3909L19.3812 27.3912L17.3214 27.3898C16.75 27.3894 15.5508 27.3439 15.0543 27.488C14.3983 27.6787 13.8893 28.2599 13.7793 28.8901C13.6941 29.3667 13.8233 29.8545 14.1377 30.2437C14.4453 30.6221 14.9051 30.8745 15.4167 30.9459C15.8083 30.9973 16.9376 30.9721 17.3737 30.9716L21.2021 30.9705L34.7036 30.9708L37.4741 30.9703C38.2528 30.9703 39.1844 30.9308 39.928 31.0859C41.0719 31.3242 42.0868 31.9215 42.7942 32.7727C43.587 33.7308 43.9276 34.9364 43.7405 36.1232C43.5512 37.3213 42.8405 38.4002 41.7681 39.1176C41.296 39.4364 40.7248 39.695 40.1547 39.8371C39.9775 39.8813 39.5457 39.9402 39.3995 40H38.2892C38.1935 39.9639 37.9048 39.9121 37.7901 39.8902C37.521 39.8388 37.3209 39.7919 37.0602 39.7029C35.827 39.2734 34.8319 38.4163 34.2937 37.32C33.8109 36.3269 33.7364 35.2091 34.0837 34.1703C34.1934 33.847 34.326 33.6245 34.4542 33.3198C34.1683 33.3419 33.7682 33.3349 33.4743 33.3357L31.8575 33.3368L26.8761 33.337L23.4607 33.3366C23.1322 33.3365 22.1009 33.3536 21.8272 33.3138C21.9311 33.5049 22.0252 33.7003 22.1092 33.8994C22.5735 35.0207 22.5276 36.2639 21.9817 37.3544C21.4188 38.4762 20.3786 39.3418 19.0997 39.7524C18.771 39.8583 18.3581 39.8934 18.0633 40H16.8914C16.7599 39.9539 16.373 39.8881 16.2145 39.852C15.7038 39.7356 15.315 39.5866 14.8671 39.3352C13.7412 38.7073 12.9372 37.6971 12.6335 36.5286C12.3753 35.5308 12.4972 34.4829 12.9791 33.5562C13.1319 33.2667 13.3007 33.0416 13.4839 32.7716C12.8417 32.4296 12.3434 32.0194 11.9317 31.4515C11.2629 30.527 11.0295 29.3973 11.2837 28.3152C11.5227 27.282 12.2143 26.3267 13.1893 25.7476L13.1739 25.7337C12.236 24.8869 11.595 23.8903 11.3215 22.7055C11.1298 21.8749 11.1803 20.9267 11.1804 20.07L11.1815 16.9021L11.1789 4.8707C10.4127 4.7125 9.48205 4.56948 8.7038 4.43101L3.96909 3.58801L2.25592 3.28212C1.35784 3.1247 0.234982 3.08923 0.189417 1.98885C0.176144 1.67049 0.303859 1.36059 0.543966 1.12853C1.16202 0.537391 2.01139 0.870805 2.76454 0.981805C2.89532 1.00108 3.02968 1.02991 3.16039 1.05338L6.3525 1.62015L10.3762 2.3358C10.5878 2.37383 10.8016 2.4076 11.0123 2.4489C11.821 2.60738 12.5354 2.61402 13.152 3.17368C13.4215 3.42084 13.611 3.73067 13.6998 4.06923C13.7908 4.42916 13.7619 5.36129 13.7619 5.78912L13.7583 8.61273C14.4265 8.67812 15.0954 8.73812 15.7648 8.79281C16.0683 7.68693 16.2793 6.98294 16.8743 5.9438C18.3847 3.27369 21.0344 1.28423 24.204 0.440583C24.7286 0.301517 25.2624 0.193077 25.8022 0.115923C26.0439 0.0823375 26.4625 0.0679368 26.6755 0ZM27.8116 19.5773C33.0391 19.4676 37.1812 15.5295 37.0676 10.777C36.9539 6.02449 32.6277 2.25367 27.3998 2.35053C22.1619 2.44758 18.0043 6.38977 18.1181 11.1513C18.2319 15.913 22.5739 19.6872 27.8116 19.5773Z"
                      fill="#6F3DCB"
                    />
                    <path
                      d="M32.1143 6.99685C32.5129 6.95411 32.8938 7.03977 33.196 7.28741C33.4488 7.49815 33.5982 7.79225 33.6106 8.10387C33.6273 8.47669 33.4782 8.75481 33.1962 9.01739C32.7541 9.42918 32.2987 9.83723 31.8513 10.244L29.2094 12.6457L27.7246 13.9958C27.2824 14.398 26.8525 14.9266 26.1877 14.9462C25.4695 14.9675 24.9954 14.4037 24.5197 13.9868L23.0317 12.6828C22.8107 12.4823 22.5806 12.2873 22.3541 12.0918C22.0157 11.7999 21.6744 11.5511 21.5983 11.1054C21.5439 10.7866 21.6312 10.4611 21.8409 10.2008C22.0393 9.95825 22.3363 9.79801 22.6655 9.75598C23.4082 9.65481 23.7989 10.0905 24.2767 10.5122L25.4552 11.5464C25.6558 11.7216 25.9254 11.9793 26.1472 12.1239C26.326 11.9165 26.7951 11.5106 27.0154 11.3101L28.6381 9.83465L30.4897 8.14926C30.8232 7.84583 31.1683 7.51795 31.5212 7.23444C31.6883 7.10018 31.9017 7.04272 32.1143 6.99685Z"
                      fill="#6F3DCB"
                    />
                    <path
                      d="M13.7679 10.9746C14.276 11.0427 15.0008 11.0832 15.5354 11.1315C15.5479 13.2346 16.3354 15.406 17.6363 17.1366C19.4451 19.5463 22.2337 21.203 25.3875 21.7416C28.5383 22.278 31.7943 21.648 34.4317 19.9916C36.9383 18.4241 38.8571 15.868 39.4133 13.1375C40.0116 13.1806 40.6181 13.2363 41.2169 13.2851C41.1879 14.2313 41.2128 15.2862 41.213 16.2407L41.2133 19.8306C41.2133 20.4825 41.2612 21.7306 41.1044 22.3135C40.9382 22.9327 40.5927 23.5002 40.1038 23.9571C39.2931 24.7133 38.3208 25.024 37.178 25.0338L23.3859 25.0327L19.3894 25.0338C18.7602 25.034 17.5826 25.0658 17.0043 24.9765C16.2147 24.8551 15.486 24.5138 14.919 23.9998C14.3755 23.5113 14.0027 22.888 13.8472 22.2077C13.7436 21.7441 13.7674 21.083 13.7676 20.5938L13.7681 18.5897L13.7679 10.9746Z"
                      fill="#D2C3EF"
                    />
                    <path
                      d="M17.2219 33.3316C18.5336 33.2102 19.7044 34.08 19.8347 35.2727C19.965 36.4654 19.005 37.5276 17.6927 37.6428C16.3852 37.7577 15.2221 36.889 15.0924 35.7007C14.9626 34.5123 15.9152 33.4527 17.2219 33.3316Z"
                      fill="#D2C3EF"
                    />
                    <path
                      d="M38.5799 33.3324C39.8903 33.2071 41.0636 34.0724 41.1991 35.2639C41.3345 36.4553 40.3806 37.5205 39.0698 37.6415C37.7623 37.7622 36.5942 36.8977 36.4591 35.7092C36.324 34.5208 37.2729 33.4573 38.5799 33.3324Z"
                      fill="#D2C3EF"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1544_38275">
                      <rect width="44" height="40" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-center mb-2">
                Process Refund for Order {selectedOrder?.id}
              </h3>
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-1">Items Ordered</div>
              <div className="text-xs mb-3">Refund Amount: Lorem Ipsum</div>
              <div className="text-xs mb-3">Refund Type: Full / Partial</div>
              <div className="text-xs mb-3">Price: Lorem Ipsum</div>
              <div className="font-semibold mt-3 mb-1">Customer Info</div>
              <div className="text-xs mb-3">Shipping address: Lorem Ipsum</div>
              <div className="text-xs mb-3">Contact: Lorem Ipsum</div>
              <div className="font-semibold mt-3 mb-1">Payment Details</div>
              <div className="text-xs mb-3">Amount: Lorem Ipsum</div>
              <div className="text-xs mb-3">Transaction ID: Lorem Ipsum</div>
              <div className="text-xs mb-3">Date: Lorem Ipsum</div>
              <div className="font-semibold mt-3 mb-1">
                Session Summary & Notes
              </div>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none"
                rows={2}
                placeholder="Enter summary or notes..."
              ></textarea>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="flex-1 py-2 rounded-lg bg-(--primary-500) text-white font-medium">
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Refund;
