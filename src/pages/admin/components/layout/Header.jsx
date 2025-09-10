
import React, { useState } from "react";
import banner from "../../../../assets/banner.png"

function Header() {
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
          <div className="w-10 h-10 rounded-full">
            <img src={banner} alt="user profile"/>
          </div>
          <div className="hidden lg:block">
            <p className="text-[18px] font-[500] leading-tight">Anna Ogunyemi</p>
            <p className="text-[14px] text-gray-400 font-[400]">Super admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
