import React from "react";
import NavComponent from "./components/NavComponent";

function General() {
  return (
    <div className="pt-6 w-full min-h-screen">
      <h2 className="text-lg sm:text-xl font-bold mb-4">Settings</h2>
      <NavComponent />

      <div className="flex flex-col gap-6">
        {/* Platform Info */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-semibold mb-2">Platform Info</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 pt-4 w-full ">
              {/* platform name */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-medium">Platform Name</label>
                <input
                  type="text"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  value="LavenderCare"
                  readOnly
                />
              </div>

              {/* logo upload */}
              <div className="flex mt-4 flex-col gap-2 w-full sm:w-1/2">
                <label className="text-xs font-medium">Logo Upload</label>
                <div className="flex gap-2">
                  <img
                    src="/src/assets/banner.png"
                    alt="Logo"
                    className="w-16 h-16 rounded-full border"
                  />
                  <img
                    src="/src/assets/react.svg"
                    alt="Favicon"
                    className="w-10 h-10 rounded-full border"
                  />
                </div>
              </div>

              {/* tagline */}
              <div className="pt-4 flex gap-1 w-full flex-col">
                <label className="text-xs font-medium">Tagline</label>
                <input
                  type="text"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  value="Supporting mothers through their journey"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        {/* Localization */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-semibold pb-4 mb-2">Localization</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full ">
              <label className="text-xs font-medium">Default Language</label>
              <input
                type="text"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value="English"
                readOnly
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-medium">Default Timezone</label>
              <input
                type="text"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value="Africa/Lagos"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Legal & Policies */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-semibold pb-4 mb-2">Legal & Policies</h3>
          <label className="text-xs font-medium mb-1">Terms & Policies</label>

          {/* rich text editor area */}
          <div className="border px-[17px] pt-[18px] pb-[12px] border-gray-300 rounded-sm">
            {/* rich text editor options + heading */}
            <div className="flex flex-col gap-3 md:flex-row md:justify-between pb-4 md:items-center">
              <p className="text-[12px] text-[#1A1A1A]">Rich Text Editor</p>

              <div className="flex gap-1 items-center">
                <button className="border border-[#E5E7EB] bg-[#F8F9FC] py-1 px-2 text-[12px] rounded-sm">
                  Bold
                </button>
                <button className="border border-[#E5E7EB] bg-[#F8F9FC] py-1 px-2 text-[12px] rounded-sm">
                  Italic
                </button>
                <button className="border border-[#E5E7EB] bg-[#F8F9FC] py-1 px-2 text-[12px] rounded-sm">
                  Link
                </button>
              </div>
            </div>

            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none mb-2"
              rows={3}
              readOnly
            >
              LavenderCare Terms of Service and Privacy Policy...
            </textarea>
          </div>

          <div className="flex gap-2 text-[12px] pt-2 text-gray-400">
            Last updated: Jul 10, 2023 | Version: v1.0
          </div>
        </div>
        {/* Other */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold pb-4">Other</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-medium">
                Default User Sign-up Mode
              </label>
              <input
                type="text"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value="Open"
                readOnly
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-medium">
                Allow Community Creation
              </label>
              <span className="text-xs text-gray-500">
                Users can create new communities
              </span>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-2 justify-end mt-4">
          <button className="py-2 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium text-xs sm:text-sm">
            Cancel
          </button>
          <button className="py-2 px-4 rounded-lg bg-primary text-white font-medium text-xs sm:text-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default General;
