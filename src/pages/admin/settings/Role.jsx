import React, { useEffect, useState } from "react";
import NavComponent from "./components/NavComponent";
import { Link, useNavigate } from "react-router-dom";
import useApiReqs from "../../../hooks/useApiReqs";
import { useSelector } from "react-redux";
import { getUserDetailsState } from "../../../redux/slices/userDetailsSlice";
import { formatDate1 } from "../../../lib/utils";


function Role() {

  const navigate = useNavigate()

  const { deleteRole } = useApiReqs()

  const roles = useSelector(state => getUserDetailsState(state).roles)

  return (
    <div className="pt-6 w-full min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-2xl">Roles</span>
        <Link to="/admin/settings/roles/new"
          className="bg-(--primary-500) text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-medium"
        >
          + New Role
        </Link>
      </div>

      <NavComponent />
      <div className="bg-white rounded-xl shadow-sm p-4">
        {/* table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Role Name
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Description
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Created On
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map((role, idx) => (
                <tr key={idx}>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {role.name}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {role.description}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {formatDate1({ dateISO: role?.created_at })}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap flex gap-2 items-center">
                    {/* edit icon */}
                    {
                      role?.name?.toLowerCase().includes("super admin")
                        ?
                        <></>
                        :
                        <>
                          <button 
                            onClick={() => navigate('/admin/settings/roles/edit', { state: { role_id: role?.id } })}
                            className="cursor-pointer"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 6H7.33333C6.97971 6 6.64057 6.14048 6.39052 6.39052C6.14048 6.64057 6 6.97971 6 7.33333V16.6667C6 17.0203 6.14048 17.3594 6.39052 17.6095C6.64057 17.8595 6.97971 18 7.33333 18H16.6667C17.0203 18 17.3594 17.8595 17.6095 17.6095C17.8595 17.3594 18 17.0203 18 16.6667V12"
                                stroke="#6F3DCB"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M16.2499 5.75015C16.5151 5.48493 16.8748 5.33594 17.2499 5.33594C17.625 5.33594 17.9847 5.48493 18.2499 5.75015C18.5151 6.01537 18.6641 6.37508 18.6641 6.75015C18.6641 7.12522 18.5151 7.48493 18.2499 7.75015L12.2412 13.7595C12.0829 13.9176 11.8874 14.0334 11.6726 14.0962L9.75723 14.6562C9.69987 14.6729 9.63906 14.6739 9.58117 14.6591C9.52329 14.6442 9.47045 14.6141 9.4282 14.5719C9.38594 14.5296 9.35583 14.4768 9.341 14.4189C9.32617 14.361 9.32717 14.3002 9.3439 14.2428L9.9039 12.3275C9.96692 12.1129 10.0829 11.9175 10.2412 11.7595L16.2499 5.75015Z"
                                stroke="#6F3DCB"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </button>
                          {/* delete btn */}
                          <button 
                            onClick={() => {
                              deleteRole({
                                callBack: ({}) => {},
                                role_id: role?.id
                              })
                            }}
                            className="cursor-pointer"
                          >
                            <svg
                              width="24"
                              height="25"
                              viewBox="0 0 24 25"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_1976_92873)">
                                <path
                                  d="M6 8.5H18"
                                  stroke="#E41C11"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M16.6668 8.5V17.8333C16.6668 18.5 16.0002 19.1667 15.3335 19.1667H8.66683C8.00016 19.1667 7.3335 18.5 7.3335 17.8333V8.5"
                                  stroke="#E41C11"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M9.3335 8.49967V7.16634C9.3335 6.49967 10.0002 5.83301 10.6668 5.83301H13.3335C14.0002 5.83301 14.6668 6.49967 14.6668 7.16634V8.49967"
                                  stroke="#E41C11"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M10.6665 11.833V15.833"
                                  stroke="#E41C11"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M13.3335 11.833V15.833"
                                  stroke="#E41C11"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_1976_92873">
                                  <rect
                                    width="16"
                                    height="16"
                                    fill="white"
                                    transform="translate(4 4.5)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </button>
                        </>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 sm:py-4 gap-2 mt-2">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-0">
            Showing 1 to 5 of 5 roles
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-(--primary-500) text-white text-xs sm:text-sm">
              1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Role;
