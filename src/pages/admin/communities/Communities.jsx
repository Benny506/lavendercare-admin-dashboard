import React, { useState } from "react";
import { FiGrid, FiList } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const communitiesData = [
  {
    name: "MamaCare Support",
    description: "Support group for new mothers",
    visibility: "Public",
    members: 1245,
    moderators: ["Anna O.", "Dr. Kemi"],
    posts: 32,
  },
  {
    name: "Prenatal Nutrition",
    description: "Healthy eating during pregnancy",
    visibility: "Private",
    members: 632,
    moderators: ["NutritionTeam"],
    posts: 14,
  },
  {
    name: "Postpartum Mental Health",
    description: "Support for new mothers",
    visibility: "Private",
    members: 2013,
    moderators: ["Dr. L."],
    posts: 58,
  },
  {
    name: "Lactation Help",
    description: "Breastfeeding support and advice",
    visibility: "Public",
    members: 887,
    moderators: ["Nurse T."],
    posts: 21,
  },
  {
    name: "New Mothers Lagos",
    description: "Local support group",
    visibility: "Public",
    members: 4120,
    moderators: ["CommunityTeam"],
    posts: 100,
  },
];

function Communities() {
  const [view, setView] = useState("list");
  const [showDelete, setShowDelete] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const navigate = useNavigate();

  const handleDelete = (community, e) => {
    e.stopPropagation();
    setSelectedCommunity(community);
    setShowDelete(true);
  };
  const handleDrawer = (community, e) => {
    e.stopPropagation();
    setSelectedCommunity(community);
    setShowDrawer(true);
  };
  const handleCloseDrawer = () => setShowDrawer(false);

  return (
    <div className="pt-6 w-full min-h-screen">
      {/* Breadcrumb */}
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
          All communities
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Communities</h2>
        <button
          className="bg-(--primary-500) cursor-pointer text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-medium"
          onClick={() => navigate("/admin/communities/create")}
        >
          + New Community
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search communities..."
          className="border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-64 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-2 items-center">
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm bg-white text-gray-700 focus:outline-none">
            <option>Visibility: All</option>
            <option>Public</option>
            <option>Private</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm bg-white text-gray-700 focus:outline-none">
            <option>Sort: Activity</option>
            <option>Sort: Members</option>
          </select>
          <button
            className={`p-2 rounded cursor-pointer ${
              view === "list"
                ? "bg-(--primary-500) text-white"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
            onClick={() => setView("list")}
          >
            <FiList />
          </button>
          <button
            className={`p-2 rounded cursor-pointer ${
              view === "grid"
                ? "bg-(--primary-500) text-white"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
            onClick={() => setView("grid")}
          >
            <FiGrid />
          </button>
        </div>
      </div>

      {/* List View */}
      {view === "list" && (
        <div className="overflow-x-auto bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Community Name
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Visibility
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Members
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Moderators
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Posts (last 7 days)
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {communitiesData.map((community, idx) => (
                <tr key={idx}>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {community.name}
                    <div className="text-xs text-gray-400">
                      {community.description}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        community.visibility === "Public"
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {community.visibility}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {community.members}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {community.moderators.join(", ")}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {community.posts}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap flex gap-2 items-center">
                    <button
                      className="text-primary"
                      onClick={(e) => handleDrawer(community, e)}
                    >
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_1976_86059)">
                          <path
                            d="M6.06218 12.2322C6.00662 12.0826 6.00662 11.9179 6.06218 11.7682C6.60331 10.4561 7.52185 9.33427 8.70136 8.54484C9.88086 7.75541 11.2682 7.33398 12.6875 7.33398C14.1068 7.33398 15.4942 7.75541 16.6737 8.54484C17.8532 9.33427 18.7717 10.4561 19.3128 11.7682C19.3684 11.9179 19.3684 12.0826 19.3128 12.2322C18.7717 13.5443 17.8532 14.6662 16.6737 15.4556C15.4942 16.2451 14.1068 16.6665 12.6875 16.6665C11.2682 16.6665 9.88086 16.2451 8.70136 15.4556C7.52185 14.6662 6.60331 13.5443 6.06218 12.2322Z"
                            stroke="#6F3DCB"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M12.6875 14C13.7921 14 14.6875 13.1046 14.6875 12C14.6875 10.8954 13.7921 10 12.6875 10C11.5829 10 10.6875 10.8954 10.6875 12C10.6875 13.1046 11.5829 14 12.6875 14Z"
                            stroke="#6F3DCB"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1976_86059">
                            <rect
                              width="16"
                              height="16"
                              fill="white"
                              transform="translate(4.6875 4)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                    <button className="text-gray-500">
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_1976_86063)">
                          <path
                            d="M12.6875 6H8.02083C7.66721 6 7.32807 6.14048 7.07802 6.39052C6.82798 6.64057 6.6875 6.97971 6.6875 7.33333V16.6667C6.6875 17.0203 6.82798 17.3594 7.07802 17.6095C7.32807 17.8595 7.66721 18 8.02083 18H17.3542C17.7078 18 18.0469 17.8595 18.297 17.6095C18.547 17.3594 18.6875 17.0203 18.6875 16.6667V12"
                            stroke="#6F3DCB"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M16.9374 5.75015C17.2026 5.48493 17.5623 5.33594 17.9374 5.33594C18.3125 5.33594 18.6722 5.48493 18.9374 5.75015C19.2026 6.01537 19.3516 6.37508 19.3516 6.75015C19.3516 7.12522 19.2026 7.48493 18.9374 7.75015L12.9287 13.7595C12.7704 13.9176 12.5749 14.0334 12.3601 14.0962L10.4447 14.6562C10.3874 14.6729 10.3266 14.6739 10.2687 14.6591C10.2108 14.6442 10.158 14.6141 10.1157 14.5719C10.0734 14.5296 10.0433 14.4768 10.0285 14.4189C10.0137 14.361 10.0147 14.3002 10.0314 14.2428L10.5914 12.3275C10.6544 12.1129 10.7704 11.9175 10.9287 11.7595L16.9374 5.75015Z"
                            stroke="#6F3DCB"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1976_86063">
                            <rect
                              width="16"
                              height="16"
                              fill="white"
                              transform="translate(4.6875 4)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                    <button
                      className="text-red-500"
                      onClick={(e) => handleDelete(community, e)}
                    >
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.6875 8H18.6875"
                          stroke="#E41C11"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M17.3543 8V17.3333C17.3543 18 16.6877 18.6667 16.021 18.6667H9.35433C8.68766 18.6667 8.021 18 8.021 17.3333V8"
                          stroke="#E41C11"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M10.021 7.99967V6.66634C10.021 5.99967 10.6877 5.33301 11.3543 5.33301H14.021C14.6877 5.33301 15.3543 5.99967 15.3543 6.66634V7.99967"
                          stroke="#E41C11"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M11.354 11.333V15.333"
                          stroke="#E41C11"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M14.021 11.333V15.333"
                          stroke="#E41C11"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {communitiesData.map((community, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 flex flex-col gap-2"
            >
              <div className="flex flex-col justify-between mb-2">
                <span className="font-bold text-sm">{community.name}</span>
                <span className="text-xs text-gray-400">
                  {community.description}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    community.visibility === "Public"
                      ? "bg-green-100 text-green-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {community.visibility}
                </span>

                <div className="text-xs mb-1">{community.members} members</div>
              </div>

              <div className="text-xs text-gray-400 mb-2"></div>
              <div className="text-xs text-gray-300 flex flex-col mb-1">
                Moderators:{" "}
                <span className="text-sm text-black">
                  {community.moderators.join(", ")}
                </span>
              </div>
              <div className="text-xs mb-1">
                <div className="text-xs text-gray-300 flex flex-col mb-1">
                  Posts (last 7 days):{" "}
                  <span className="text-sm text-black">{community.posts}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="text-primary border border-primary rounded px-3 py-1 text-xs"
                  onClick={(e) => handleDrawer(community, e)}
                >
                  View
                </button>
                <button className="text-gray-500 border border-gray-300 rounded px-3 py-1 text-xs">
                  Edit
                </button>
                <button
                  className="text-red-500 border border-red-300 rounded px-3 py-1 text-xs"
                  onClick={(e) => handleDelete(community, e)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 sm:py-4 gap-2 mt-2">
        <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-0">
          Showing 1 to 5 of 12 communities
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-sm bg-(--primary-500) text-white text-xs sm:text-sm">
            1
          </button>
          <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-sm text-gray-500 text-xs sm:text-sm">
            2
          </button>
          <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-sm text-gray-500 text-xs sm:text-sm">
            3
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/80 bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative animate-fadeIn">
            <h3 className="text-lg font-bold mb-2">Delete community?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action is irreversible. All community content will be
              permanently removed.
            </p>
            <div className="flex gap-2 mt-6 justify-end">
              <button
                className="py-2 px-4 rounded-lg cursor-pointer bg-white border border-gray-200 text-gray-700 font-medium text-xs sm:text-sm"
                onClick={() => setShowDelete(false)}
              >
                Cancel
              </button>
              <button className="py-2 px-4 rounded-lg cursor-pointer bg-red-500 text-white font-medium text-xs sm:text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side Drawer for Community Details */}
      {showDrawer && selectedCommunity && (
        <div
          className="fixed inset-0 z-[4000] flex items-end justify-end bg-black/80 bg-opacity-30"
        >
          <div className="w-full max-w-md bg-white h-screen shadow-lg p-6 relative animate-fadeIn">
            {/* modal title */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Community Details</h2>
              <button
                className=" text-gray-400 cursor-pointer text-2xl"
                onClick={handleCloseDrawer}
              >
                ×
              </button>
            </div>

            <h3 className="text-lg font-medium mb-1">
              {selectedCommunity.name}
            </h3>
            <div className="text-xs text-gray-400 mb-8">
              {selectedCommunity.description}
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm">Visibility:</p>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedCommunity.visibility === "Public"
                      ? "bg-green-100 text-green-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {selectedCommunity.visibility}
                </span>
              </div>
            </div>
            <div className="mb-2 flex justify-between items-center text-xs">
              <span className="text-sm">Members:</span>
              {selectedCommunity.members}
            </div>

            <div className="mb-2 flex justify-between items-center text-xs">
              <span className="text-sm">Posts (last 7 days):</span>

              {selectedCommunity.posts}
            </div>

            <div className="mt-8 text-sm">
              Moderators:
              <div className="pb-4">
                {selectedCommunity.moderators.join(", ")}{" "}
              </div>
              <span className="mt-4 text-(--primary-500) ml-2 cursor-pointer">
                + Add Moderator
              </span>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <button className="py-2 px-4 rounded-lg bg-(--primary-500) text-white font-medium text-xs sm:text-sm">
                Promote
              </button>
              <button className="py-2 px-4 rounded-lgtext-(--primary-500) border-1 rounded-sm border-(--primary-500) font-medium text-xs sm:text-sm">
                Archive
              </button>
              <button className="py-2 px-4 rounded-lg bg-red-500 text-white font-medium text-xs sm:text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Communities;
