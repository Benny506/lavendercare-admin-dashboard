import React from "react";
import { Link } from "react-router-dom";

function CreateCommunity() {
  return (
    <div className="pt-6 w-full min-h-screen ">
      <div className="flex items-center gap-1 mb-4">
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
        <span className="text-xs text-gray-400">Communities</span>
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
        <span className="text-xs text-(--primary-500) font-semibold">
          Create community
        </span>
      </div>

      {/* create community title */}
      <div className="mb-4 flex items-center gap-1">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.99996 15.8337L4.16663 10.0003L9.99996 4.16699"
            stroke="#4D4D4D"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.8333 10H4.16663"
            stroke="#4D4D4D"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <Link
          to="/admin/communities/all-communities"
          className="text-lg sm:text-xl font-bold"
        >
          Create Community
        </Link>
      </div>

      {/* community body wrapper */}
      <div className="bg-white rounded-xl mb-8 p-4 2xl:w-6xl 2xl:mx-auto">
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Community Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              placeholder="Enter community name"
              required
            />
            <span className="text-xs text-red-500">
              Community name is required
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Short Handle / Slug
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              placeholder="e.g. newmothers, lactation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              placeholder="Describe what this community is about..."
              rows={3}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Visibility</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="visibility"
                  value="Public"
                  className="accent-primary"
                  defaultChecked
                />{" "}
                Public
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="visibility"
                  value="Private"
                  className="accent-primary"
                />{" "}
                Private
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Group Type</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              required
            >
              <option value="">Select group type</option>
              <option value="support">Support</option>
              <option value="education">Education</option>
              <option value="local">Local</option>
            </select>
            <span className="text-xs text-red-500">
              Please select a community type
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Initial Moderators
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              placeholder="Add moderators"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Cover Image
            </label>
            <div className="flex flex-col items-center gap-2 border border-dotted border-gray-200 rounded-lg p-4">
              <span className="text-xs text-gray-400">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 6V30"
                    stroke="#4D4D4D"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M34 16L24 6L14 16"
                    stroke="#4D4D4D"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M42 30V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V30"
                    stroke="#4D4D4D"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <input type="file" className="hidden" />
              <p className=" text-(--primary-500) rounded text-xs">
                Upload file
              </p>
              <span className="text-xs pt-2 text-gray-400">
                Recommended: 1200x400px, JPG or PNG
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Community Rules
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              placeholder="Enter community rules..."
              rows={7}
            ></textarea>
            <span className="text-sm text-[#4D4D4D]">
              Common rules: No spam, respect privacy, be kind, etc.
            </span>
          </div>
          <div>
            <label className="block text-sm pb-4 font-medium mb-1">
              Launch Options
            </label>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="launch"
                    value="immediate"
                    className="accent-primary"
                    defaultChecked
                  />{" "}
                  Launch Immediately
                </label>
                <span className="text-[12px] text-gray-300">
                  Community will be visible as soon as it's created.
                </span>
              </div>

              <label className="flex items-center gap-2">
                Schedule Launch Date
              </label>
            </div>

            <input
              type="date"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none mt-2"
            />
          </div>
          <div className="flex gap-2 mt-6 justify-end">
            <button
              type="button"
              className="py-2 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium text-xs sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-lg bg-(--primary-500) text-white font-medium text-xs sm:text-sm"
            >
              Create Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCommunity;
