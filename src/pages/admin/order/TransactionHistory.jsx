import React from 'react'


import React from "react";

const TransactionHistory = () => {
    return (
        <div className="p-2 sm:p-4 md:p-6 w-full min-h-screen bg-[#F8F9FB]">
            {/* Breadcrumb */}
            <div className="mb-2 sm:mb-4 flex flex-wrap items-center gap-1 text-xs sm:text-sm">
                <span className="text-gray-400">Orders & Transactions</span>
                <span className="text-gray-400">/</span>
                <span className="text-primary font-medium">Transaction History</span>
            </div>

            {/* Title & Description */}
            <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Transaction History</h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">Manage and process vendor payout requests.</p>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search doctor or mother"
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full md:w-64 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                    <button className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50 whitespace-nowrap">Export CSV</button>
                    <select className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-xs sm:text-sm focus:outline-none">
                        <option>Latest</option>
                        <option>Oldest</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Reference ID</th>
                            <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">May 1, 2025</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Order</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">₦8,200</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-primary font-medium">ORD-23423</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <button className="text-primary font-medium text-xs sm:text-sm">View</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">August 30, 2025</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Refund</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">₦4,200</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-primary font-medium">REF-47890</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <button className="text-primary font-medium text-xs sm:text-sm">View</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">July 2, 2025</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Payout</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">₦12,000</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-primary font-medium">PAY-11233</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <button className="text-primary font-medium text-xs sm:text-sm">View</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">August 18, 2025</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Order</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">₦8,200</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-primary font-medium">ORD-33443</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <button className="text-primary font-medium text-xs sm:text-sm">View</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Sept 6, 2025</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">Refund</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">₦1,500</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-primary font-medium">REF-69067</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <button className="text-primary font-medium text-xs sm:text-sm">View</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 gap-2">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-0 cursor-pointer">Previous</div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-primary text-white text-xs sm:text-sm">1</button>
                        <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">2</button>
                        <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">3</button>
                        <span className="text-gray-400">...</span>
                        <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">6</button>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 cursor-pointer">Next</div>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
