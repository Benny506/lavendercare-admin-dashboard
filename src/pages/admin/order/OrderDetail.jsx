import React from "react";

function OrderDetail() {
  return (
    <div className="pt-6 w-full min-h-screen">
      {/* breadcrumb */}
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
        <span className="text-(--primary-500) font-semibold">Orders</span>
      </div>

      <div className="bg-white mt-4 mb-8 p-4 rounded-md">
        {/*  order title */}
        <h2 className="text-lg sm:text-xl font-bold mb-1">Order Details</h2>
        <div className="flex items-center gap-1 mb-3">
          <div className="text-xs text-gray-500">Order ID:</div>
          <div className="text-xs">123-567890</div>
        </div>

        {/* order details card */}
        <div className=" mx-auto mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 mb-4">
            <div className="border-b border-t py-4 border-gray-300">
              <div className="text-xs text-gray-500 mb-1">Type</div>
              <div className="font-semibold">Order</div>
            </div>

            <div className="border-b border-t py-4 border-gray-300">
              <div className="text-xs text-gray-500 mb-1">Status</div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                Shipped
              </span>
            </div>

            <div className="border-b py-4 border-gray-300">
              <div className="text-xs text-gray-500 mb-1">Amount</div>
              <div>$120.00</div>
            </div>

            <div className="border-b py-4 border-gray-300">
              <div className="text-xs text-gray-500 mb-1">Date</div>
              <div>July 14, 2024</div>
            </div>

            <div className="border-b py-4 border-gray-300">
              <div className="text-xs text-gray-500 mb-1">Payment Method</div>
              <div>Credit Card</div>
            </div>

            <div className="border-b py-4 border-gray-300">
              <div className="text-xs text-gray-500 mb-1">Reference ID</div>
              <div>REF-98765v321</div>
            </div>

            <div className="border-b py-4 border-gray-300">
              <div className="text-xs text-gray-500 mb-1">User</div>
              <div>Sophia Clark</div>
            </div>

            <div className="border-b py-4 border-gray-300">
              <div className="text-xs text-gray-500 mb-1">Vendor</div>
              <div>Acme Store</div>
            </div>
          </div>

          {/* item details */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-[24px]">Item Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-b border-t py-4 border-gray-300">
                <div className="text-xs text-gray-500 mb-1">Product</div>
                <div>Herbal Recovery Tea</div>
              </div>

              <div className="border-b border-t py-4 border-gray-300">
                <div className="text-xs text-gray-500 mb-1">Unit Price</div>
                <div>₦2,000</div>
              </div>

              <div className="border-b py-4 border-gray-300">
                <div className="text-xs text-gray-500 mb-1">Total</div>
                <div>₦4,000</div>
              </div>

              <div className="border-b py-4 border-gray-300">
                <div className="text-xs text-gray-500 mb-1">
                  Discount Applied
                </div>
                <div>₦800</div>
              </div>
            </div>
          </div>

          {/* shipping details */}
          <div>
            <h3 className="font-semibold mb-2 text-[24px]">Shipping Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className=" border-t py-4 border-gray-300">
                <div className="text-xs text-gray-500 mb-1">
                  Shipping Address
                </div>
                <div>123, Lagos road</div>
              </div>

              <div className=" border-t py-4 border-gray-300">
                <div className="text-xs text-gray-500 mb-1">Contact</div>
                <div>081673929393</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
