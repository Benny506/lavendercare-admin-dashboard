import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import Collapse from "../Collapse";
import Icons from "../Icons";
// import { FaChevronDown, FaChevronRight, FaHome, FaUsers, FaUserMd, FaFileAlt, FaShoppingCart, FaClipboardList, FaHeadset, FaChartBar, FaUsersCog, FaCog } from 'react-icons/fa';

const sidebarMenu = [
  {
    title: "Dashboard",
    Icon: ({ size, color }) => <Icons name={'dashboard'} size={size} color={color} />,
    path: "/admin/dashboard",
    submenu: [],
  },
  {
    title: "User Management",
    Icon: ({ size, color }) => <Icons name={'userManagement'} size={size} color={color} />,
    path: "/admin/user-management",
    submenu: [
      { title: "All Users", path: "/admin/user-management" },
      { title: "Activity Logs", path: "/admin/user-management/activity-logs" },
    ],
  },
  {
    title: "Mothers",
    Icon: ({ size, color }) => <Icons name={'serviceProviders'} size={size} color={color} />,
    path: "/admin/mothers",
    submenu: [
      { title: "View All", path: "/admin/mothers" },
      // { title: "Messages", path: "/admin/mother-messages" },
    ],
  },
  {
    title: "Service Providers",
    Icon: ({ size, color }) => <Icons name={'serviceProviders'} size={size} color={color} />,
    path: "/admin/service-provider",
    submenu: [
      { title: "View All", path: "/admin/service-providers" },
      { title: "Performance", path: "/admin/service-provider/performance" },
      {
        title: "Disputes and Issues",
        path: "/admin/service-provider/disputes",
      },
    ],
  },
  {
    title: "Healthcare Providers",
    Icon: ({ size, color }) => <Icons name={'healthcareProviders'} size={size} color={color} />,    
    path: "/admin/healthcare-provider",
    submenu: [
      { title: "View All", path: "/admin/healthcare-provider" },
      { title: "Review Credentials", path: "/admin/healthcare-provider/credentials-review" },
      {
        title: "Mental Health Screening",
        path: "/admin/healthcare-provider/mental-health-screening",
      },
      { title: "Caseloads Summaries", path: "/admin/healthcare-provider/caseloads" },
    ],
  },
  {
    title: "Content",
    Icon: ({ size, color }) => <Icons name={'content'} size={size} color={color} />,    
    path: "/admin/content",
    submenu: [
      { title: "Blog Articles", path: "/admin/content/blog" },
      { title: "Educational Resources", path: "/admin/content/resource" },
      { title: "Promotional Banners", path: "/admin/content/promotions" },
    ],
  },
  {
    title: "Marketplace",
    Icon: ({ size, color }) => <Icons name={'marketPlace'} size={size} color={color} />,    
    path: "/admin/marketplace",
    submenu: [
      { title: "Manage Products", path: "/admin/marketplace/manage-product" },
      { title: "Promotions and Discounts", path: "/admin/marketplace/promotions" },
    ],
  },
  {
    title: "Order and Transactions",
    Icon: ({ size, color }) => <Icons name={'orderAndTransaction'} size={size} color={color} />, 
    path: "/admin/order",
    submenu: [
      { title: "Orders", path: "/admin/orders" },
      { title: "Refunds", path: "/admin/order/refunds" },
      { title: "Vendor Payout Requests", path: "/admin/order/payout-requests" },
      { title: "Transaction History", path: "/admin/order/transaction-history" },
    ],
  },
  {
    title: "Support Tickets",
    Icon: ({ size, color }) => <Icons name={'supportTickets'} size={size} color={color} />,
    path: "/admin/support",
    submenu: [
      { title: "All Tickets", path: "/admin/support/all-tickets" },
      { title: "Escalated", path: "/admin/support/escalated-tickets" },
    ],
  },
  {
    title: "Analytics",
    Icon: ({ size, color }) => <Icons name={'analytics'} size={size} color={color} />,
    path: "/admin/analytics",
    submenu: [
      { title: "Sales and Revenue Reports", path: "/admin/analytics/sales" },
      {
        title: "Booking and Consultation Volumes",
        path: "/admin/analytics/bookings",
      },
      { title: "Screening Outcomes", path: "/admin/analytics/screening" },
      { title: "User Management", path: "/admin/analytics/user-mangagement" },
      { title: "Provider and Vendor", path: "/admin/analytics/providers" },
      {
        title: "Custom Report Builder",
        path: "/admin/analytics/report-builder",
      },
    ],
  },
  {
    title: "Communities",
    Icon: ({ size, color }) => <Icons name={'communities'} size={size} color={color} />,
    path: "/admin/communities",
    submenu: [
      { title: "All Communities", path: "/admin/communities" },
      { title: "Create Community", path: "/admin/communities/create" },
      { title: "Moderators", path: "/admin/communities/moderators" },
      { title: "Activity Feed", path: "/admin/communities/activity" },
      { title: "Flagged Content", path: "/admin/communities/flagged" },
    ],
  },
  {
    title: "Settings",
    Icon: ({ size, color }) => <Icons name={'settings'} size={size} color={color} />,
    path: "/admin/settings",
    submenu: [
      { title: "General Settings", path: "/admin/settings/general" },
      { title: "Roles", path: "/admin/settings/roles" },
      { title: "Permissions", path: "/admin/settings/permissions" },
    ],
  },
];

function Sidebar() {

  const { pathname } = useLocation()

  const [openMenu, setOpenMenu] = useState(null);
  const [activeNav, setActiveNav] = useState('Dashboard')

  useEffect(() => {

    const navs = sidebarMenu.map(s => ({ 
      path: s.path,
      title: s.title
    }))

    let active = ''

    for(let i = 0; i < navs?.length; i++){
      if(pathname.includes(navs[i].path)){
        active = navs[i].title
        
        break
      }
    }

    if(!active){
      setActiveNav('Dashboard')
    
    } else{
      setActiveNav(active)
    }
  }, [pathname])

  const toggleMenu = (title, index) => {
    setOpenMenu(index);
  };

  return (
    <div className="w-[260px] py-[24px] px-[8px] h-screen bg-(--primary-500) shadow-lg lg:block hidden sticky top-0 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white">

          LavenderCare</h2>
      </div>

      <nav className="mt-4">
        {sidebarMenu.map((item, index) => {

          const { Icon } = item

          // const Icon = () => <></>

          const isActive = item.title === activeNav ? true : false

          return (
            <div key={index} className="mb-1">
              {item.submenu.length > 0 ? (
                <div
                  key={index}
                >
                  <Collapse
                    header={
                      <div
                        // onClick={() => toggleMenu(index)}
                        style={{
                          borderBottom: openMenu === index ? '1px solid white' : 'none',
                          backgroundColor: isActive ? "#FFF" : 'transparent'
                         }}
                        className={`cursor-pointer flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg`}
                      >
                        <span className='mr-3 text-gray-500'>
                          <Icon color={isActive ? '#6F3DCB' : '#FFF'} />
                        </span>
                        <span className={`flex-1 text-[14px] ${isActive ? 'text-[#6F3DCB]' : 'text-white'}`}>{item.title}</span>
                        <span className="text-white">
                          {
                            openMenu === index
                              ?
                              <FaChevronDown size={13} color={isActive ? '#6F3DCB' : '#FFF'} />
                              :
                              <FaChevronUp size={13} color={isActive ? '#6F3DCB' : '#FFF'}  />
                          }
                        </span>
                      </div>
                    }
                    isOpen={openMenu === index}
                    onToggle={() => toggleMenu(item.title, index)}
                    duration={250}
                  >

                    <div className="ml-2 mt-1 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <NavLink
                          onClick={() => setActiveNav(item.title)}
                          key={subIndex}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm text-white text-[14px] relative rounded-r-lg transition-colors duration-200`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              {isActive && (
                                <span className={`absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white`}></span>
                              )}
                              {subItem.title}
                            </>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </Collapse>
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  style={{
                    backgroundColor: isActive ? "#FFF" : 'transparent'
                  }}
                  onClick={() => setActiveNav(item?.title)}
                  className={({ isActive }) =>
                    `flex items-center px-4 rounded-lg text-[14px] py-3  border-b border-(--primary-500) text-white transition-colors duration-200 ${isActive ? "text-blue-600 font-medium border-[#9F7DDC]" : ""
                    }`
                  }
                >
                  <span className={`mr-3 ${isActive ? 'text-[#6F3DCB]' : 'text-white'}`}>
                    <Icon color={isActive ? '#6F3DCB' : '#FFF'} />
                  </span>
                  <span className={`${isActive ? 'text-[#6F3DCB]' : 'text-white'}`}>{item.title}</span>
                </NavLink>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
