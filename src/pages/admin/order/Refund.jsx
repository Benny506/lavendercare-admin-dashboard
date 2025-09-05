import React, { useState } from 'react';

const refundData = [
    {
        id: '#10023',
        user: 'Dr. Emeka Obi',
        amount: '₦5,200',
        reason: 'Item not as described',
    },
    {
        id: '#10023',
        user: 'Dr. Emeka Obi',
        amount: '₦3,800',
        reason: 'Damaged during shipping',
    },
    {
        id: '#10023',
        user: 'Nurse Lillian James',
        amount: '₦7,500',
        reason: 'Wrong item received',
    },
    {
        id: '#10028',
        user: 'Duola Funke Adeyemi',
        amount: '₦2,900',
        reason: 'Changed mind',
    },
    {
        id: '#10023',
        user: 'Dr. Emeka Obi',
        amount: '₦4,500',
        reason: 'Late delivery',
    },
];

function Refund() {
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleProcess = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    return (
        <div className="p-2 sm:p-4 md:p-6 w-full min-h-screen bg-[#F8F9FB]">
            {/* Breadcrumb */}
            <div className="mb-2 sm:mb-4 flex flex-wrap items-center gap-1 text-xs sm:text-sm">
                <span className="text-gray-400">Orders & Transactions</span>
                <span className="text-gray-400">/</span>
                <span className="text-primary font-medium">Refunds</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Refund Requests</h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">Process cancellation & refunds</p>
            <div className="bg-white rounded-xl shadow-sm p-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3 sm:mb-4">
                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm bg-white text-gray-700 w-full md:w-auto max-w-[160px] focus:outline-none">
                        <option>Last 30 days</option>
                        <option>Last 7 days</option>
                        <option>All time</option>
                    </select>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search doctor or mother"
                            className="border border-gray-200 rounded-lg px-3 py-2 w-full md:w-64 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50 whitespace-nowrap">Filter by: All</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">Order ID</th>
                                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">User</th>
                                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">Amount Requested</th>
                                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">Reason</th>
                                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {refundData.map((order, idx) => (
                                <tr key={idx}>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{order.id}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{order.user}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{order.amount}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{order.reason}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap flex gap-2 items-center">
                                        <button className="text-primary font-medium text-xs sm:text-sm border border-primary rounded px-3 py-1" onClick={() => handleProcess(order)}>Process</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 gap-2 mt-2">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-0 cursor-pointer">Previous</div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-primary text-white text-xs sm:text-sm">1</button>
                        <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">2</button>
                        <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">3</button>
                        <span className="text-gray-400">...</span>
                        <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-gray-500 text-xs sm:text-sm">10</button>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 cursor-pointer">Next</div>
                </div>
            </div>
            {/* Modal Popup for Process */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative animate-fadeIn">
                        <button className="absolute left-4 top-4 text-primary font-medium" onClick={() => setShowModal(false)}>&lt; Back</button>
                        <div className="flex flex-col items-center mb-4">
                            <div className="bg-[#F1ECFA] rounded-full p-3 mb-2">
                                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <h3 className="text-lg font-bold text-center mb-2">Process Refund for Order {selectedOrder?.id}</h3>
                        </div>
                        <div className="mb-4">
                            <div className="font-semibold mb-1">Items Ordered</div>
                            <div className="text-xs mb-1">Refund Amount: Lorem Ipsum</div>
                            <div className="text-xs mb-1">Refund Type: Full / Partial</div>
                            <div className="text-xs mb-1">Price: Lorem Ipsum</div>
                            <div className="font-semibold mt-3 mb-1">Customer Info</div>
                            <div className="text-xs mb-1">Shipping address: Lorem Ipsum</div>
                            <div className="text-xs mb-1">Contact: Lorem Ipsum</div>
                            <div className="font-semibold mt-3 mb-1">Payment Details</div>
                            <div className="text-xs mb-1">Amount: Lorem Ipsum</div>
                            <div className="text-xs mb-1">Transaction ID: Lorem Ipsum</div>
                            <div className="text-xs mb-1">Date: Lorem Ipsum</div>
                            <div className="font-semibold mt-3 mb-1">Session Summary & Notes</div>
                            <textarea className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none" rows={2} placeholder="Enter summary or notes..."></textarea>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="flex-1 py-2 rounded-lg bg-primary text-white font-medium">Confirm Refund</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Refund;
