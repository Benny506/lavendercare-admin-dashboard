import React, { useState } from "react";
import banner from "../../../../assets/banner.png";
import { useSelector } from "react-redux";
import { getUserDetailsState } from "../../../../redux/slices/userDetailsSlice";

function Header() {

  const profile = useSelector(state => getUserDetailsState(state).profile)

  return (
    <div className="flex sticky items-center py-3 px-[12px] lg:px-[32px] top-0 bg-white z-[500] justify-end">
      <div className="flex gap-1 md:gap-4">
        {/*  */}
        <div className="border-[3px] border-gray-200 rounded-sm w-max p-2">
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_878_85586)">
              <path
                d="M12 22.5C13.1 22.5 14 21.6 14 20.5H10C10 21.6 10.9 22.5 12 22.5ZM18 16.5V11.5C18 8.43 16.37 5.86 13.5 5.18V4.5C13.5 3.67 12.83 3 12 3C11.17 3 10.5 3.67 10.5 4.5V5.18C7.64 5.86 6 8.42 6 11.5V16.5L4 18.5V19.5H20V18.5L18 16.5ZM16 17.5H8V11.5C8 9.02 9.51 7 12 7C14.49 7 16 9.02 16 11.5V17.5Z"
                fill="#6F3DCB"
              />
            </g>
            <defs>
              <clipPath id="clip0_878_85586">
                <rect
                  width="24"
                  height="24"
                  fill="white"
                  transform="translate(0 0.5)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/*  */}
        <div className="flex gap-2">
          {/* <div className="w-10 h-10 rounded-full">
            <img src={banner} alt="user profile" />
          </div> */}
          <div className="hidden lg:block">
            <p className="text-[18px] font-[500] leading-tight">
              { profile?.username }
            </p>
            <p className="text-[14px] text-gray-400 font-[400]">{profile?.role}</p>
          </div>
        </div>
      </div>

      {/* Search Modal for mobile/tab */}
      {/* {showSearchModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 bg-opacity-30 lg:hidden">
          <div className="bg-white rounded-xl w-[90%] shadow-lg p-6 max-w-md relative animate-fadeIn">
            <button
              className="absolute flex items-center left-4 top-4 text-(--primary-500) font-medium"
              onClick={() => setShowSearchModal(false)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_2298_4778)">
                  <path
                    d="M16.6668 9.16634H6.52516L11.1835 4.50801L10.0002 3.33301L3.3335 9.99967L10.0002 16.6663L11.1752 15.4913L6.52516 10.833H16.6668V9.16634Z"
                    fill="#6F3DCB"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2298_4778">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Back
            </button>
            <h3 className="text-lg font-bold text-center pt-8 mb-4">Search</h3>
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>
        </div>
      )} */}
    </div>
  );
}

export default Header;
