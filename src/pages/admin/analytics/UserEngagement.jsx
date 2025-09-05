import React from 'react';

const summaryCards = [
    { label: 'Avg Daily Active Users', value: '1,300', sub: 'Last 7 days', change: '+5.3%' },
    { label: 'Total Sign-ups', value: '360', sub: 'Last 7 days', change: '+3.3%' },
    { label: 'Total Community Posts', value: '570', sub: 'Last 7 days', change: '+5.2%' },
];

const engagementDetails = [
    { date: 'Jan 01, 2023', dau: 1200, newUsers: 45, posts: 78, comments: 124 },
    { date: 'Jan 02, 2023', dau: 1150, newUsers: 38, posts: 110, comments: 119 },
    { date: 'Jan 03, 2023', dau: 1300, newUsers: 52, posts: 82, comments: 135 },
    { date: 'Jan 04, 2023', dau: 1250, newUsers: 47, posts: 75, comments: 127 },
    { date: 'Jan 05, 2023', dau: 1280, newUsers: 60, posts: 90, comments: 140 },
    { date: 'Jan 06, 2023', dau: 1320, newUsers: 55, posts: 88, comments: 138 },
    { date: 'Jan 07, 2023', dau: 1350, newUsers: 70, posts: 95, comments: 150 },
];

function UserEngagement() {
    return (
        <div className="p-2 sm:p-4 md:p-6 w-full min-h-screen bg-[#F8F9FB]">
            {/* Breadcrumb */}
            <div className="mb-2 sm:mb-4 flex flex-wrap items-center gap-1 text-xs sm:text-sm">
                <span className="text-gray-400">Analytics</span>
                <span className="text-gray-400">/</span>
                <span className="text-primary font-medium">User Engagement</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold mb-4">User Engagement</h2>
            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div className="flex gap-2">
                    <button className="bg-primary text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-medium">DAU</button>
                    <button className="bg-white text-gray-700 border border-gray-200 rounded-lg px-4 py-2 text-xs sm:text-sm font-medium">Sign-ups</button>
                    <button className="bg-white text-gray-700 border border-gray-200 rounded-lg px-4 py-2 text-xs sm:text-sm font-medium">Posts</button>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    <input type="text" className="border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none" placeholder="Aug 10, 2025 - Aug 17, 2025" readOnly />
                    <button className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50">Filters</button>
                    <button className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50">Export CSV</button>
                    <button className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-700 text-xs sm:text-sm hover:bg-gray-50">Export PDF</button>
                </div>
            </div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-6">
                {summaryCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-start">
                        <div className="text-xs text-gray-400 mb-1">{card.label}</div>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <div className="text-xs text-gray-400 mt-1">{card.sub} <span className="text-green-500 font-semibold">{card.change}</span></div>
                    </div>
                ))}
            </div>
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
                    <div className="text-xs text-gray-400 mb-2">DAU Trend</div>
                    {/* Chart Placeholder */}
                    <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">[Line Chart]</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
                    <div className="text-xs text-gray-400 mb-2">New Sign-ups by Day</div>
                    {/* Chart Placeholder */}
                    <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">[Bar Chart]</div>
                </div>
            </div>
            {/* Engagement Details Table */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="text-lg font-bold mb-4">Engagement Details</div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">Date</th>
                                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">DAU</th>
                                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">New Users</th>
                                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">Posts</th>
                                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">Comments</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {engagementDetails.map((row, idx) => (
                                <tr key={idx}>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{row.date}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{row.dau}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{row.newUsers}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{row.posts}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{row.comments}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UserEngagement;
