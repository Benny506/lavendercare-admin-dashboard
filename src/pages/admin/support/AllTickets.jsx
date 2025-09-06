import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ticketsData = [
  {
    id: "#626",
    subject: "Cannot schedule consult",
    raisedBy: "Grace Okoro",
    priority: "High",
    status: "Open",
    assignee: "-",
  },
  {
    id: "#532",
    subject: "Payment not processing",
    raisedBy: "John Smith",
    priority: "High",
    status: "Resolved",
    assignee: "Admin a",
  },
  {
    id: "#535",
    subject: "Vendor payout delay",
    raisedBy: "MamaCare Vendor",
    priority: "Critical",
    status: "Escalated",
    assignee: "Admin B",
  },
  {
    id: "#536",
    subject: "Article formatting issue",
    raisedBy: "Sarah",
    priority: "Medium",
    status: "Resolved",
    assignee: "Admin C",
  },
  {
    id: "#649P",
    subject: "App login error",
    raisedBy: "David Nguyen",
    priority: "Low",
    status: "Resolved",
    assignee: "-",
  },
];

const priorityClass = {
  High: "bg-orange-100 text-orange-600",
  Critical: "bg-red-100 text-red-600",
  Medium: "bg-green-100 text-green-600 bg-opacity-30 text-green-700",
  Low: "bg-green-100 text-green-600 bg-opacity-30 text-green-700",
};

const statusClass = {
  Open: "bg-[#F1ECFA] text-primary",
  Resolved: "bg-green-100 text-green-600",
  Escalated: "bg-red-100 text-red-600",
};

function AllTickets() {
  const [showAssign, setShowAssign] = useState(false);
  const navigate = useNavigate();

  const handleAssign = (ticket, e) => {
    e.stopPropagation();
    setShowAssign(true);
  };

  const handleDetails = (ticket, e) => {
    if (e) e.stopPropagation();
    navigate(`/admin/support/ticket-details/${ticket.id.replace("#", "")}`);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 w-full min-h-screen bg-[#F8F9FB]">
      {/* Breadcrumb */}
      <div className="mb-2 sm:mb-4 flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        <span className="text-gray-400">Support Tickets</span>
        <span className="text-gray-400">/</span>
        <span className="text-primary font-medium">All Tickets</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold">All Tickets</h2>
        <button className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50 whitespace-nowrap">
          All
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3 sm:mb-4">
          <input
            type="text"
            placeholder="Search by ticket ID, subject, or user"
            className="border border-gray-200 rounded-lg px-3 py-2 w-full md:w-64 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50 whitespace-nowrap">
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Ticket ID
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Subject
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Raised By
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Priority
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Assignee
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ticketsData.map((ticket, idx) => (
                <tr
                  key={idx}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleDetails(ticket)}
                >
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {ticket.id}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {ticket.subject}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {ticket.raisedBy}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        priorityClass[ticket.priority]
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusClass[ticket.status]
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {ticket.assignee}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap flex gap-2 items-center">
                    <button
                      className="text-primary font-medium text-xs sm:text-sm border border-primary rounded px-3 py-1"
                      onClick={(e) => handleAssign(ticket, e)}
                    >
                      Assign
                    </button>
                    <button
                      className="text-gray-500 hover:text-primary"
                      onClick={() => handleDetails(ticket)}
                    >
                      ttf
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 gap-2 mt-2">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-0 cursor-pointer">
            Previous
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-primary text-white text-xs sm:text-sm">
              1
            </button>
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">
              2
            </button>
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">
              3
            </button>
            <span className="text-gray-400">...</span>
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">
              10
            </button>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 cursor-pointer">
            Next
          </div>
        </div>
      </div>

      {/* Assign Admin Modal */}
      {showAssign && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/80 bg-opacity-30">
          <div className="bg-white w-[90%] rounded-xl shadow-lg p-6 max-w-md relative animate-fadeIn">
            <button
              className="absolute cursor-pointer flex items-center gap-1 text-(--primary-500) left-4 top-4 text-primary font-semibold"
              onClick={() => setShowAssign(false)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2298_41842)">
                  <path
                    d="M16.6668 9.16683H6.52516L11.1835 4.5085L10.0002 3.3335L3.3335 10.0002L10.0002 16.6668L11.1752 15.4918L6.52516 10.8335H16.6668V9.16683Z"
                    fill="#6F3DCB"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2298_41842">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Back
            </button>
            <h3 className="text-[24px] font-bold pt-8 mb-4">Assign Admin</h3>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">
                Choose Admin
              </label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
                <option>Admin a</option>
                <option>Admin b</option>
                <option>Admin c</option>
              </select>
              <button className="mt-2 text-primary text-right text-xs font-medium">
                + Create Admin role
              </button>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium"
                onClick={() => setShowAssign(false)}
              >
                Cancel
              </button>
              <button onClick={() => setShowAssign(false)} className="flex-1 cursor-pointer py-2 rounded-lg bg-(--primary-500) text-white font-medium">
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllTickets;
