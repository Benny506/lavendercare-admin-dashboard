import React from "react";
import banner from "../../../../assets/banner.png"

function Header() {
  return (
    <div className="flex sticky items-center py-3 px-[12px] lg:px-[32px] top-0 bg-white z-[500] justify-between">
      <div className="relative">
        <svg
          className="absolute top-[12px] left-[14px]"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_1918_29784)">
            <path
              d="M12.9167 11.6667H12.2583L12.025 11.4417C12.8417 10.4917 13.3333 9.25833 13.3333 7.91667C13.3333 4.925 10.9083 2.5 7.91667 2.5C4.925 2.5 2.5 4.925 2.5 7.91667C2.5 10.9083 4.925 13.3333 7.91667 13.3333C9.25833 13.3333 10.4917 12.8417 11.4417 12.025L11.6667 12.2583V12.9167L15.8333 17.075L17.075 15.8333L12.9167 11.6667ZM7.91667 11.6667C5.84167 11.6667 4.16667 9.99167 4.16667 7.91667C4.16667 5.84167 5.84167 4.16667 7.91667 4.16667C9.99167 4.16667 11.6667 5.84167 11.6667 7.91667C11.6667 9.99167 9.99167 11.6667 7.91667 11.6667Z"
              fill="#020201"
            />
          </g>
          <defs>
            <clipPath id="clip0_1918_29784">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>

        <input
          type="text"
          placeholder="Search anything..."
          className="border py-[10px] h-[44px] focus:border-black w-[180px] md:w-[320px] focus:outline-1 pr-[14px] pl-[40px] border-gray-300  rounded-sm text-(--gray-500)"
        />
      </div>

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
            <g clip-path="url(#clip0_878_85586)">
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
