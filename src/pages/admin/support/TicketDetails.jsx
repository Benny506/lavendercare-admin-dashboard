import React, { useState } from 'react';

const ticket = {
    id: '#426',
    raisedBy: 'Grace Okoro',
    role: 'Mother',
    submittedOn: 'Aug 6, 2025 – 11:15 AM',
    priority: 'High',
    assignee: 'Unassigned',
    status: 'Open',
    lastActivity: 'Aug 7, 2025 – 10:02 AM',
    tags: 'Booking, Scheduling',
    closedBy: '-',
    resolutionDate: '-',
};

function TicketDetails() {
    const [showChat, setShowChat] = useState(false);

    if (showChat) {
        // Chat UI (screenshot 2)
        return (
            <div className="p-2 sm:p-4 md:p-6 w-full min-h-screen bg-[#F8F9FB]">
                <div className="mb-2 sm:mb-4 flex flex-wrap items-center gap-1 text-xs sm:text-sm">
                    <span className="text-gray-400">Support Tickets</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-primary font-medium">All Tickets</span>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-white rounded-xl shadow-sm p-4">
                        <h2 className="text-lg sm:text-xl font-bold mb-2">Payment not processing - #4235</h2>
                        <div className="bg-gray-100 rounded-lg p-4 mb-2 w-full max-w-xs">
                            <div className="text-gray-700 text-sm mb-1">Hello, Good day</div>
                            <div className="text-xs text-gray-400 text-right">1:32 PM</div>
                        </div>
                        <div className="mt-8"></div>
                        <div className="fixed md:static bottom-0 left-0 w-full md:w-auto bg-white md:bg-transparent p-2 md:p-0 flex items-center gap-2 border-t md:border-none z-10">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button className="bg-primary text-white px-4 py-2 rounded-lg text-xs sm:text-sm">Send</button>
                        </div>
                    </div>
                    <div className="w-full md:w-80 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <img
                                    src="https://randomuser.me/api/portraits/women/44.jpg"
                                    alt="User"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <div className="font-semibold text-sm">Chinenye Okeke</div>
                                    <div className="text-xs text-gray-400">User Information</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">Age: -</div>
                            <div className="text-xs text-gray-500 mb-1">Contact: email@example.com</div>
                            <div className="text-xs text-gray-500 mb-1">Phone no: 0801 234 5678</div>
                            <div className="text-xs text-gray-500 mb-1">User type: Mother</div>
                            <div className="mt-4">
                                <label className="block text-xs font-medium mb-1">Resolution Notes</label>
                                <textarea className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none" rows={2}></textarea>
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                                <button className="w-full py-2 rounded-lg bg-primary text-white font-medium text-xs sm:text-sm">Mark as Resolved</button>
                                <button className="w-full py-2 rounded-lg bg-gray-100 text-gray-700 font-medium text-xs sm:text-sm">Involve supervisor</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Ticket Details UI (screenshot 1)
    return (
        <div className="p-2 sm:p-4 md:p-6 w-full min-h-screen bg-[#F8F9FB]">
            <div className="mb-2 sm:mb-4 flex flex-wrap items-center gap-1 text-xs sm:text-sm">
                <span className="text-gray-400">Support Tickets</span>
                <span className="text-gray-400">/</span>
                <span className="text-primary font-medium cursor-pointer">All Tickets</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-lg sm:text-xl font-bold mb-2">Ticket Details</h2>
                <div className="text-xs text-gray-400 mb-4">Ticket ID: {ticket.id}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Raised By</div>
                        <div className="text-sm font-medium">{ticket.raisedBy}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Role</div>
                        <span className="bg-[#F1ECFA] text-primary px-2 py-1 rounded-full text-xs font-medium">{ticket.role}</span>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Submitted On</div>
                        <div className="text-sm font-medium">{ticket.submittedOn}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Priority</div>
                        <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">{ticket.priority}</span>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Assignee</div>
                        <div className="text-sm font-medium">{ticket.assignee}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Status</div>
                        <span className="bg-[#F1ECFA] text-primary px-2 py-1 rounded-full text-xs font-medium">{ticket.status}</span>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Last Activity</div>
                        <div className="text-sm font-medium">{ticket.lastActivity}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Tags</div>
                        <div className="text-sm font-medium">{ticket.tags}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Closed by</div>
                        <div className="text-sm font-medium">{ticket.closedBy}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Resolution Date</div>
                        <div className="text-sm font-medium">{ticket.resolutionDate}</div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                    <button className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium text-xs sm:text-sm">Reassign</button>
                    <button className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium text-xs sm:text-sm">Mark as Resolved</button>
                    <button className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium text-xs sm:text-sm">Escalate</button>
                    <button className="flex-1 py-2 rounded-lg bg-primary text-white font-medium text-xs sm:text-sm" onClick={() => setShowChat(true)}>
                        Enter Chat
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TicketDetails;
