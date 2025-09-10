import React from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { name: 'General Settings', path: '/admin/settings/general' },
  { name: 'Roles', path: '/admin/settings/roles' },
  { name: 'Permissions', path: '/admin/settings/permissions' },
];

function NavComponent() {
  return (
    <div className="flex gap-4 border-b border-gray-200 mb-6">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `py-2 px-4 text-sm transition-colors font-semibold duration-150 ${isActive ? 'text-(--primary-500) border-b-2 border-(--primary-500)' : 'text-gray-500 hover:text-primary'}`
          }
        >
          {tab.name}
        </NavLink>
      ))}
    </div>
  );
}

export default NavComponent;
