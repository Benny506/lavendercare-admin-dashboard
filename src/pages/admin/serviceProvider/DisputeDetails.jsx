import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

function DisputeDetails() {
  const { id } = useParams();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className=" bg-[#F8F9FB] mt-6 min-h-screen flex flex-col">
      {/*  */}
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col bg-white rounded-xl p-4 min-h-[400px]">
          {/* issue id block */}
          <div className="flex gap-2 pb-3 border-b border-b-gray-300">
            <Link to="/admin/service-provider/disputes">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="24" height="24" rx="5" fill="#F5F5F5" />
                <g opacity="0.8">
                  <path
                    d="M15.41 16.4066L10.83 12.0002L15.41 7.59383L14 6.24023L8 12.0002L14 17.7602L15.41 16.4066Z"
                    fill="#202224"
                  />
                </g>
              </svg>
            </Link>
            <span className="text-purple-600 font-semibold">
              Issue ID: #{id}
            </span>
            <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-semibold ml-2">
              In Progress
            </span>
          </div>

          <div className="flex flex-col pt-4 gap-4 flex-1 mb-4">
            {/* Example chat bubbles */}
            <div className="self-start bg-gray-50 rounded-lg p-3 max-w-xs text-sm">
              Hello, Good day{" "}
              <span className="block text-[10px] text-gray-400 mt-1">
                12:47 PM
              </span>
            </div>
            <div className="self-start bg-gray-50 rounded-lg p-3 max-w-xs text-sm flex flex-col">
              <span className="flex items-center gap-2">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx="8" fill="#F3F3F3" />
                  <path
                    d="M8 12h8M12 8v8"
                    stroke="#BDBDBD"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                agreement.pdf{" "}
                <span className="text-xs text-gray-400">(3.5 MB)</span>
              </span>
              <span className="block text-[10px] text-gray-400 mt-1">
                12:47 PM
              </span>
            </div>
            <div className="self-end bg-purple-100 rounded-lg p-3 max-w-xs text-sm text-purple-900 flex flex-col">
              <span className="flex items-center gap-2">
                <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                  <rect width="32" height="32" rx="8" fill="#A78BFA" />
                  <polygon points="12,10 24,16 12,22" fill="white" />
                </svg>
                Hello ...
              </span>
              <span className="block text-[10px] text-gray-400 mt-1 self-end">
                12:47 PM
              </span>
            </div>
            <div className="self-start bg-gray-50 rounded-lg p-3 max-w-xs text-sm flex flex-col">
              <span className="flex items-center gap-2">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx="8" fill="#F3F3F3" />
                  <path
                    d="M8 12h8M12 8v8"
                    stroke="#BDBDBD"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-xs text-gray-400">3:03</span>
              </span>
              <span className="block text-[10px] text-gray-400 mt-1">
                12:47 PM
              </span>
            </div>
          </div>
          {/* Input */}
          <div className="flex items-center gap-2 mt-auto border-t pt-2">
            <button className="text-gray-400">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <circle
                  cx="10"
                  cy="10"
                  r="9"
                  stroke="#BDBDBD"
                  strokeWidth="2"
                />
                <path
                  d="M7 10h6M10 7v6"
                  stroke="#BDBDBD"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <input
              className="flex-1 border rounded px-3 py-2 text-xs"
              placeholder="Type a message..."
            />
            <button className="bg-purple-600 text-white px-4 py-2 rounded">
              Send
            </button>
          </div>
        </div>
        {/* Right-side Popup Trigger */}
        <div className="hidden md:block w-0"></div>
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded font-semibold text-xs">
            Mark as Resolved
          </button>
          <button
            className="bg-gray-100 px-2 py-2 rounded"
            onClick={() => setShowPopup(true)}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="2" fill="#8B8B8A" />
              <circle cx="10" cy="5" r="2" fill="#8B8B8A" />
              <circle cx="10" cy="15" r="2" fill="#8B8B8A" />
            </svg>
          </button>
        </div>
        {/* Popup (Image 3) */}
        {showPopup && (
          <div
            className="fixed inset-0 z-30 flex justify-end items-end md:items-center bg-black bg-opacity-20"
            onClick={() => setShowPopup(false)}
          >
            <div
              className="w-full md:w-80 bg-white rounded-t-2xl md:rounded-2xl shadow-lg p-6 m-0 md:mr-8 md:mb-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">Chinenye Okeke</div>
                  <div className="text-xs text-gray-500">User Information</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-2">Age: -</div>
              <div className="text-xs text-gray-500 mb-2">
                Contact: email@example.com
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Phone no: 0801 234 5678
              </div>
              <div className="mb-2">
                <label className="block text-xs font-medium mb-1">
                  Resolution Notes
                </label>
                <textarea
                  className="w-full border rounded p-2 text-xs"
                  rows={2}
                  placeholder="-"
                />
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded">
                  Mark as Resolved
                </button>
                <button className="bg-gray-100 px-4 py-2 rounded">
                  Involve supervisor
                </button>
                <button className="bg-gray-100 px-4 py-2 rounded">
                  Contact Vendor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DisputeDetails;
