import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
// import { FaChevronDown, FaChevronRight, FaHome, FaUsers, FaUserMd, FaFileAlt, FaShoppingCart, FaClipboardList, FaHeadset, FaChartBar, FaUsersCog, FaCog } from 'react-icons/fa';

const sidebarMenu = [
  {
    title: 'Dashboard',
    // icon: <FaHome className="text-lg" />,
    path: '/admin/dashboard',
    submenu: []
  },
  {
    title: 'User Management',
    // icon: <FaUsers className="text-lg" />,
    path: '#',
    submenu: [
      { title: 'All Users', path: '/admin/user-management' },
      { title: 'Activity Logs', path: '/admin/activity-logs' }
    ]
  },
  {
    title: 'Service Providers',
    // icon: <FaUserMd className="text-lg" />,
    path: '#',
    submenu: [
      { title: 'View All', path: '/admin/service-providers' },
      { title: 'Performance', path: '/admin/service-provider/performance' },
      { title: 'Disputes and Issues', path: '/admin/service-provider/disputes' }
    ]
  },
  {
    title: 'Healthcare Providers',
    // icon: <FaUserMd className="text-lg" />,
    path: '#',
    submenu: [
      { title: 'View All', path: '/admin/healthcare-provider' },
      { title: 'Review Credentials', path: '/admin/credentials-review' },
      { title: 'Mental Health Screening', path: '/admin/mental-health-screening' },
      { title: 'Caseloads Summaries', path: '/admin/caseloads' }
    ]
  },
  {
    title: 'Content',
    // icon: <FaFileAlt className="text-lg" />,
    path: '#',
    submenu: [
      { title: 'Blog Articles', path: '/admin/blog' },
      { title: 'Educational Resources', path: '/admin/resources' },
      { title: 'Promotional Banners', path: '/admin/banners' }
    ]
  },
  {
    title: 'Marketplace',
    // icon: <FaShoppingCart className="text-lg" />,
    path: '#',
    submenu: [
      { title: 'Manage Products', path: '/admin/products' },
      { title: 'Promotions and Discounts', path: '/admin/promotions' }
    ]
  },
  {
    title: 'Order and Transactions',
    // icon: <FaClipboardList className="text-lg" />,
    path: '#',
    submenu: [
      { title: 'Orders', path: '/admin/orders' },
      { title: 'Refunds', path: '/admin/refunds' },
      { title: 'Vendor Payout Requests', path: '/admin/payouts' },
      { title: 'Transaction History', path: '/admin/transactions' }
    ]
  },
  {
    title: 'Support Tickets',
    // icon: <FaHeadset className="text-lg" />,
    path: '#',
    submenu: [
      { title: 'All Tickets', path: '/admin/support-tickets' },
      { title: 'Escalated', path: '/admin/escalated-tickets' }
    ]
  },
  {
    title: 'Analytics',
    // icon: <FaChartBar className="text-lg" />,
    path: '#',
    submenu: [
      { title: 'Sales and Revenue Reports', path: '/admin/analytics/sales' },
      { title: 'Booking and Consultation Volumes', path: '/admin/analytics/bookings' },
      { title: 'Screening Outcomes', path: '/admin/analytics/screening' },
      { title: 'User Management', path: '/admin/analytics/users' },
      { title: 'Provider and Vendor', path: '/admin/analytics/providers' },
      { title: 'Custom Report Builder', path: '/admin/analytics/report-builder' }
    ]
  },
  {
    title: 'Communities',
    // icon: <FaUsersCog className="text-lg" />,
    path: '#',
    submenu: [
      { title: 'All Communities', path: '/admin/communities' },
      { title: 'Create Community', path: '/admin/communities/create' },
      { title: 'Moderators', path: '/admin/communities/moderators' },
      { title: 'Activity Feed', path: '/admin/communities/activity' },
      { title: 'Flagged Content', path: '/admin/communities/flagged' }
    ]
  },
  {
    title: 'Settings',
    // icon: <FaCog className="text-lg" />,
    path: '#',
    submenu: [
      { title: 'General Settings', path: '/admin/settings/general' },
      { title: 'Roles', path: '/admin/settings/roles' },
      { title: 'Permissions', path: '/admin/settings/permissions' }
    ]
  }
];

function Sidebar() {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (index) => {
    setOpenMenus(prev => ({
      ...prev, [index]: !prev[index]
    }));
  };

  return (
    <div className='w-[260px] py-[24px] px-[8px] h-screen bg-(--primary-500) shadow-lg lg:block hidden sticky top-0 overflow-y-auto'>
      <div className='p-4'>
        <h2 className='text-xl font-bold text-white'>LavenderCare</h2>
      </div>
      
      <nav className='mt-4'>
        {sidebarMenu.map((item, index) => (
          <div key={index} className='mb-1'>
            {item.submenu.length > 0 ? (
              <>
                <button
                  onClick={() => toggleMenu(index)}
                  className='flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-r-lg'
                >
                  {/* <span className='mr-3 text-gray-500'>{item.icon}</span> */}
                  <span className='flex-1'>{item.title}</span>
                  <span className='text-white'>
                    {openMenus[index] ? "" : ""}
                  </span>
                </button>
                
                {openMenus[index] && (
                  <div className='ml-2 mt-1 space-y-1'>
                    {item.submenu.map((subItem, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `block px-4 py-2 text-sm text-white  rounded-r-lg transition-colors duration-200 ${
                            isActive ? 'text-blue-600 font-medium border-r-4 border-blue-500' : ''
                          }`
                        }
                      >
                        {subItem.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-white transition-colors duration-200 ${
                    isActive ? 'text-blue-600 font-medium border-b-2' : ''
                  }`
                }
              >
                <span className='mr-3 text-white'>{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
