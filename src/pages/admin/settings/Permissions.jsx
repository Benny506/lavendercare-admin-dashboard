import React, { useState } from 'react';
import NavComponent from './components/NavComponent';

const roles = [
    'Super-Admin',
    'Admin',
    'Hospital Admin',
    'Provider',
    'Moderator',
];

const modules = [
    'Dashboard',
    'Users',
    'Service Providers',
    'Healthcare Providers',
    'Content',
    'Marketplace',
    'Orders',
    'Support Tickets',
    'Analytics',
    'Communities',
    'Settings',
];

function Permissions() {
    const [selectedRole, setSelectedRole] = useState(roles[0]);
    return (
        <div className="pt-6 w-full min-h-screen">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Permissions</h2>
            <NavComponent />
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Select Role</label>
                        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <button className="bg-white border border-primary text-primary rounded-lg px-4 py-2 text-xs sm:text-sm font-medium">Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500">Modules</th>
                                <th className="px-3 sm:px-6 py-3 text-center font-medium text-gray-500">View</th>
                                <th className="px-3 sm:px-6 py-3 text-center font-medium text-gray-500">Create</th>
                                <th className="px-3 sm:px-6 py-3 text-center font-medium text-gray-500">Modify</th>
                                <th className="px-3 sm:px-6 py-3 text-center font-medium text-gray-500">Delete</th>
                                <th className="px-3 sm:px-6 py-3 text-center font-medium text-gray-500">Full Access</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {modules.map((mod, idx) => (
                                <tr key={mod}>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap font-medium">{mod}</td>
                                    <td className="px-3 sm:px-6 py-4 text-center"><input type="checkbox" checked className="accent-primary" readOnly /></td>
                                    <td className="px-3 sm:px-6 py-4 text-center"><input type="checkbox" checked className="accent-primary" readOnly /></td>
                                    <td className="px-3 sm:px-6 py-4 text-center"><input type="checkbox" checked className="accent-primary" readOnly /></td>
                                    <td className="px-3 sm:px-6 py-4 text-center"><input type="checkbox" checked className="accent-primary" readOnly /></td>
                                    <td className="px-3 sm:px-6 py-4 text-center"><input type="checkbox" checked className="accent-primary" readOnly /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                    <button className="py-2 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium text-xs sm:text-sm">Reset</button>
                    <button className="py-2 px-4 rounded-lg bg-primary text-white font-medium text-xs sm:text-sm">Save Changes</button>
                </div>
                <div className="text-xs text-gray-400 mt-2">Last edited by Anna Ogunyemi on Jul 10, 2023</div>
            </div>
        </div>
    );
}

export default Permissions;
