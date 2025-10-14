import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import Collapse from "../Collapse";
import Icons from "../Icons";
import SideDrawer from "../ui/SideDrawer";
// import { FaChevronDown, FaChevronRight, FaHome, FaUsers, FaUserMd, FaFileAlt, FaShoppingCart, FaClipboardList, FaHeadset, FaChartBar, FaUsersCog, FaCog } from 'react-icons/fa';

const sidebarMenu = [
  {
    title: "Dashboard",
    Icon: ({ size, color }) => (
      <Icons name={"dashboard"} size={size} color={color} />
    ),
    path: "/admin/dashboard",
    submenu: [],
  },
  {
    title: "User Management",
    Icon: ({ size, color }) => (
      <Icons name={"userManagement"} size={size} color={color} />
    ),
    path: "/admin/user-management",
    submenu: [
      { title: "All Users", path: "/admin/user-management" },
      // { title: "Activity Logs", path: "/admin/user-management/activity-logs" },
    ],
  },
  {
    title: "Mothers",
    Icon: ({ size, color }) => (
      <Icons name={"serviceProviders"} size={size} color={color} />
    ),
    path: "/admin/mothers",
    submenu: [
      { title: "View All", path: "/admin/mothers" },
      // { title: "Messages", path: "/admin/mother-messages" },
    ],
  },
  {
    title: "Service Providers",
    Icon: ({ size, color }) => (
      <Icons name={"serviceProviders"} size={size} color={color} />
    ),
    path: "/admin/service-provider",
    submenu: [
      { title: "View All", path: "/admin/service-providers" },
      { title: "Performance", path: "/admin/service-provider/performance" },
      // {
      //   title: "Disputes and Issues",
      //   path: "/admin/service-provider/disputes",
      // },
    ],
  },
  {
    title: "Healthcare Providers",
    Icon: ({ size, color }) => <Icons name={'healthcareProviders'} size={size} color={color} />,
    path: "/admin/healthcare-provider",
    submenu: [
      { title: "View All", path: "/admin/healthcare-provider" },
      {
        title: "Review Credentials",
        path: "/admin/healthcare-provider/credentials-review",
      },
      {
        title: "Mental Health Screening",
        path: "/admin/healthcare-provider/mental-health-screening",
      },
      {
        title: "Caseloads Summaries",
        path: "/admin/healthcare-provider/caseloads",
      },
    ],
  },
  {
    title: "Content",
    Icon: ({ size, color }) => <Icons name={'content'} size={size} color={color} />,
    path: "/admin/content",
    submenu: [
      { title: "Blog Articles", path: "/admin/content/blog" },
      // { title: "Educational Resources", path: "/admin/content/resource" },
      // { title: "Promotional Banners", path: "/admin/content/promotions" },
    ],
  },
  {
    title: "Marketplace",
    Icon: ({ size, color }) => <Icons name={'marketPlace'} size={size} color={color} />,
    path: "/admin/marketplace",
    submenu: [
      { title: "Manage Products", path: "/admin/marketplace/manage-product" },
      {
        title: "Promotions and Discounts",
        // path: "/admin/marketplace/promotions",
      },
    ],
  },
  // {
  //   title: "Order and Transactions",
  //   Icon: ({ size, color }) => <Icons name={'orderAndTransaction'} size={size} color={color} />,
  //   path: "/admin/order",
  //   submenu: [
  //     { title: "Orders", path: "/admin/orders" },
  //     { title: "Refunds", path: "/admin/order/refunds" },
  //     { title: "Vendor Payout Requests", path: "/admin/order/payout-requests" },
  //     {
  //       title: "Transaction History",
  //       path: "/admin/order/transaction-history",
  //     },
  //   ],
  // },
  {
    title: "Support Tickets",
    Icon: ({ size, color }) => (
      <Icons name={"supportTickets"} size={size} color={color} />
    ),
    path: "/admin/support",
    submenu: [
      { title: "All Tickets", path: "/admin/support/all-tickets" },
      // { title: "Escalated", path: "/admin/support/escalated-tickets" },
    ],
  },
  // {
  //   title: "Analytics",
  //   Icon: ({ size, color }) => (
  //     <Icons name={"analytics"} size={size} color={color} />
  //   ),
  //   path: "/admin/analytics",
  //   submenu: [
  //     { title: "Sales and Revenue Reports", path: "/admin/analytics/sales" },
  //     {
  //       title: "Booking and Consultation Volumes",
  //       path: "/admin/analytics/bookings",
  //     },
  //     { title: "Screening Outcomes", path: "/admin/analytics/screening" },
  //     { title: "User Management", path: "/admin/analytics/user-engagement" },
  //     { title: "Provider and Vendor", path: "/admin/analytics/provider-and-vendors" },
  //     {
  //       title: "Custom Report Builder",
  //       path: "/admin/analytics/report-builder",
  //     },
  //   ],
  // },
  {
    title: "Communities",
    Icon: ({ size, color }) => (
      <Icons name={"communities"} size={size} color={color} />
    ),
    path: "/admin/communities",
    submenu: [
      { title: "All Communities", path: "/admin/communities/all-communities" },
      { title: "Create Community", path: "/admin/communities/create" },
      // { title: "Moderators", path: "/admin/communities/moderators" },
      // { title: "Activity Feed", path: "/admin/communities/activity" },
      // { title: "Flagged Content", path: "/admin/communities/flagged" },
    ],
  },
  // {
  //   title: "Settings",
  //   Icon: ({ size, color }) => (
  //     <Icons name={"settings"} size={size} color={color} />
  //   ),
  //   path: "/admin/settings",
  //   submenu: [
  //     { title: "General Settings", path: "/admin/settings/general" },
  //     { title: "Roles", path: "/admin/settings/roles" },
  //     { title: "Permissions", path: "/admin/settings/permissions" },
  //   ],
  // },
];

function Sidebar() {
  const { pathname } = useLocation();

  const [openMenu, setOpenMenu] = useState(null);
  const [activeNav, setActiveNav] = useState('Dashboard')

  useEffect(() => {
    const navs = sidebarMenu.map((s) => ({
      path: s.path,
      title: s.title,
    }));

    let active = "";

    for (let i = 0; i < navs?.length; i++) {
      if (pathname.includes(navs[i].path)) {
        active = navs[i].title

        break
      }
    }

    if (!active) {
      setActiveNav('Dashboard')

    } else {
      setActiveNav(active)
    }
  }, [pathname]);

  const toggleMenu = (title, index) => {
    setOpenMenu(index);
  };

  const Nav = () => (
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
                            <FaChevronUp size={13} color={isActive ? '#6F3DCB' : '#FFF'} />
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
  )
  useEffect(() => {
    openMenu
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [openMenu]);

  return (
    <>
      <div
        onClick={() => {
          setOpenMenu(false);
        }}
        className={`${
          openMenu
            ? "bg-black/80 w-full z-[1000] h-screen cursor-pointer fixed top-0 left-0 lg:hidden"
            : ""
        }`}
      />
      <div
        className={`${
          openMenu ? "fixed top-0 left-0 z-[4000]" : "hidden"
        } w-[260px] py-[24px] px-[8px] h-screen bg-(--primary-500) shadow-lg lg:block top-0 lg:sticky overflow-y-auto`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-white">LavenderCare</h2>
        </div>

        <nav className="mt-4">
          {sidebarMenu.map((item, index) => {
            const { Icon } = item;

            const isActive = item.title === activeNav ? true : false;

            return (
              <div key={index} className="mb-1">
                {item.submenu.length > 0 ? (
                  <div key={index}>
                    <Collapse
                      header={
                        <div
                          // onClick={() => toggleMenu(index)}
                          style={{
                            borderBottom:
                              openMenu === index ? "1px solid white" : "none",
                            backgroundColor: isActive ? "#FFF" : "transparent",
                          }}
                          className={`cursor-pointer flex items-center w-full px-4 py-3 text-left transition-colors duration-200`}
                        >
                          <span className="mr-3 text-gray-500">
                            <Icon color={isActive ? "#6F3DCB" : "#FFF"} />
                          </span>
                          <span
                            className={`flex-1 text-[14px] ${
                              isActive ? "text-[#6F3DCB]" : "text-white"
                            }`}
                          >
                            {item.title}
                          </span>
                          <span className="text-white">
                            {openMenu === index ? (
                              <FaChevronDown
                                size={13}
                                color={isActive ? "#6F3DCB" : "#FFF"}
                              />
                            ) : (
                              <FaChevronUp
                                size={13}
                                color={isActive ? "#6F3DCB" : "#FFF"}
                              />
                            )}
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
                                  <span
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white`}
                                  ></span>
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
                      backgroundColor: isActive ? "#FFF" : "transparent",
                    }}
                    onClick={() => setActiveNav(item?.title)}
                    className={({ isActive }) =>
                      `flex items-center px-4 rounded-lg text-[14px] py-3  border-b border-(--primary-500) text-white transition-colors duration-200 ${
                        isActive
                          ? "text-blue-600 font-medium border-[#9F7DDC]"
                          : ""
                      }`
                    }
                  >
                    <span
                      className={`mr-3 ${
                        isActive ? "text-[#6F3DCB]" : "text-white"
                      }`}
                    >
                      <Icon color={isActive ? "#6F3DCB" : "#FFF"} />
                    </span>
                    <span
                      className={`${
                        isActive ? "text-[#6F3DCB]" : "text-white"
                      }`}
                    >
                      {item.title}
                    </span>
                  </NavLink>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* menu bar icon */}
      <div
        onClick={() => {
          setOpenMenu((prev) => !prev);
        }}
        className="absolute left-[20px] lg:hidden z-[700] text-black top-[28px] w-[20px] h-[20px]"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 36 41"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 7.6875C0 6.27012 1.14911 5.125 2.57143 5.125H33.4286C34.8509 5.125 36 6.27012 36 7.6875C36 9.10488 34.8509 10.25 33.4286 10.25H2.57143C1.14911 10.25 0 9.10488 0 7.6875ZM0 20.5C0 19.0826 1.14911 17.9375 2.57143 17.9375H33.4286C34.8509 17.9375 36 19.0826 36 20.5C36 21.9174 34.8509 23.0625 33.4286 23.0625H2.57143C1.14911 23.0625 0 21.9174 0 20.5ZM36 33.3125C36 34.7299 34.8509 35.875 33.4286 35.875H2.57143C1.14911 35.875 0 34.7299 0 33.3125C0 31.8951 1.14911 30.75 2.57143 30.75H33.4286C34.8509 30.75 36 31.8951 36 33.3125Z"
            fill="black"
          />
        </svg>
      </div>
    </>
  );
}

export default Sidebar;
