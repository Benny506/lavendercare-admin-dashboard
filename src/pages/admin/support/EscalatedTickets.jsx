import React from "react";

function EscalatedTickets() {
  const tickets = [
    {
      id: 'PK452',
      subject: 'Cannot schedule a consult',
      raisedBy: 'Chosee Okere',
      priority: 'High',
      priorityColor: 'orange',
      status: 'Open',
      statusColor: 'purple',
      assignee: '-',
    },
    {
      id: 'PK452',
      subject: 'Payment not processing',
      raisedBy: 'John Jacobs',
      priority: 'High',
      priorityColor: 'orange',
      status: 'Open',
      statusColor: 'purple',
      assignee: '-',
    },
    {
      id: 'PK520',
      subject: 'Vendor payout delay',
      raisedBy: 'MamaCure Vendor',
      priority: 'Critical',
      priorityColor: 'red',
      status: 'Open',
      statusColor: 'purple',
      assignee: '-',
    },
    {
      id: 'PK520',
      subject: 'Article formatting issue',
      raisedBy: 'Sarah',
      priority: 'Critical',
      priorityColor: 'red',
      status: 'Open',
      statusColor: 'purple',
      assignee: 'Admin C',
    },
    {
      id: 'PK520P',
      subject: 'App login error',
      raisedBy: 'David Kiyanu',
      priority: 'Critical',
      priorityColor: 'red',
      status: 'Open',
      statusColor: 'purple',
      assignee: '-',
    },
  ];

  const getPriorityClass = (color) => {
    if (color === 'orange') return 'bg-orange-100 text-orange-600';
    if (color === 'red') return 'bg-red-100 text-red-600';
    return '';
  };
  const getStatusClass = (color) => {
    if (color === 'green') return 'bg-green-100 text-green-600';
    if (color === 'purple') return 'bg-[#F1ECFA] text-primary';
    return '';
  };

  return (
    <div className="pt-6 w-full min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-2 sm:mb-4 flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        <span className="text-gray-400">Support Tickets</span>
        <span className="text-gray-400">/</span>
        <span className="text-primary font-medium">Escalated Tickets</span>
      </div>

      {/* Title */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-between">
        <h2 className="text-[24px] font-bold mb-1 sm:mb-2">
          Escalated Tickets
        </h2>
        <button className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50 whitespace-nowrap">
          All
        </button>
      </div>

      {/* table wrapper */}
      <div className="bg-white rounded-lg p-3">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2 mb-3 sm:mb-4">
          <div className="flex items-center w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by Ticket ID, subject, or user"
              className="border border-gray-200 rounded-lg px-3 py-2 w-full md:w-64 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50 whitespace-nowrap">
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white">
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
              {tickets.map((ticket, idx) => (
                <tr key={idx}>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{ticket.id}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{ticket.subject}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{ticket.raisedBy}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`${getPriorityClass(ticket.priorityColor)} px-2 py-1 rounded-full text-xs font-medium`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`${getStatusClass(ticket.statusColor)} px-2 py-1 rounded-full text-xs font-medium`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{ticket.assignee}</td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <button className="bg-(--primary-500) py-1 px-4 rounded-sm text-white font-medium text-xs sm:text-sm">Assign</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EscalatedTickets;
