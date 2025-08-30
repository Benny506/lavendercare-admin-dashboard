function InviteUsers() {
  return (
    // breadcrumb navigation
    <div className="pb-[31px]">
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
        <p>User management</p>
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
        <p className="text-(--primary-500) font-[600]">Invite Users</p>
      </div>

      <div className="bg-white p-4 rounded-[16px]">
        <div className="w-full max-w-[425px] mx-auto">
          <h2 className="text-[24px] font-semibold py-6">Invite Users</h2>
          <form className="pb-10">
            <div className="flex flex-col gap-4">
              <label>
                <p className="text-sm text-gray-600 pb-1">Email Address</p>
                <input
                  type="text"
                  className="placeholder:text-gray-600 py-[10px] px-4 rounded-md border-gray-300 w-full border"
                  placeholder="Type your email address"
                />
              </label>

              <label className="relative">
                <p className="text-sm text-gray-600 pb-1">Role</p>
                <div
                  className="placeholder:text-gray-600 py-[10px] h-[44px] px-4 rounded-md border-gray-300 w-full border"
                  placeholder="Type your email address"
                />
                <svg
                  className="absolute right-3 top-[27px] transform translate-y-1/2 pointer-events-none"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_2109_31897)">
                    <path
                      d="M13.825 7.1582L10 10.9749L6.175 7.1582L5 8.3332L10 13.3332L15 8.3332L13.825 7.1582Z"
                      fill="#020201"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2109_31897">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </label>
              <p className="text-[16px] leading-0 text-gray-400 text-right">+ Create Admin role</p>
            </div>

            {/* invite user buttons */}
            <div className="flex pt-8 flex-col md:flex-row gap-4 md:gap-6 items-center">
                <button className="w-full bg-(--primary-50) text-(--primary-500) font-semibold py-3 rounded-full">
                    Cancel
                </button>
                <button className="w-full bg-(--primary-500) text-white py-3 font-semibold rounded-full">
                    Send Invite
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InviteUsers;
