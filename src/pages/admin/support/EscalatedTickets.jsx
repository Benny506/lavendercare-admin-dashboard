import React from 'react';

function EscalatedTickets() {
    return (
        <div className="p-2 sm:p-4 md:p-6 w-full min-h-screen bg-[#F8F9FB]">
            {/* Breadcrumb */}
            <div className="mb-2 sm:mb-4 flex flex-wrap items-center gap-1 text-xs sm:text-sm">
                <span className="text-gray-400">Support Tickets</span>
                <span className="text-gray-400">/</span>
                <span className="text-primary font-medium">Escalated Tickets</span>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Escalated Tickets</h2>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search by Ticket ID, subject, or user"
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full md:w-64 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                    <button className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50 whitespace-nowrap">All</button>
                    <button className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50 whitespace-nowrap">Filter</button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                            <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Raised By</th>
                            <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                            <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">PK452</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Cannot schedule a consult</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Chosee Okere</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold">High</span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">Open</span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">-</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <button className="text-primary font-medium text-xs sm:text-sm">Assign</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">PK452</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Payment not processing</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">John Jacobs</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold">High</span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">Open</span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">-</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <button className="text-primary font-medium text-xs sm:text-sm">Assign</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">PK520</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Vendor payout delay</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">MamaCure Vendor</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">Critical</span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">Open</span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">-</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <button className="text-primary font-medium text-xs sm:text-sm">Assign</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">PK520</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Article formatting issue</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Sarah</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">Critical</span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">Open</span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Admin C</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <button className="text-primary font-medium text-xs sm:text-sm">Assign</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">PK520P</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">App login error</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">David Kiyanu</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">Critical</span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">Open</span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">-</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <button className="text-primary font-medium text-xs sm:text-sm">Assign</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EscalatedTickets;
