import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Collapse from "../Collapse";
import Icons from "../Icons";
import logoFull from '../../../../assets/logos/logoFull.svg'

const sidebarMenu = [
  {
    title: "Dashboard",
    icon: 'dashboard',
    path: "/admin/dashboard",
    submenu: [],
  },
  {
    title: "User Management",
    icon: 'userManagement',
    path: "/admin/user-management",
    submenu: [
      { title: "All Users", path: "/admin/user-management" },
      // { title: "Activity Logs", path: "/admin/user-management/activity-logs" },
    ],
  },
  // {
  //   title: "Mothers",
  //   Icon: ({ size, color }) => (
  //     <Icons name={"serviceProviders"} size={size} color={color} />
  //   ),
  //   path: "/admin/mothers",
  //   submenu: [
  //     { title: "View All", path: "/admin/mothers" },
  //     // { title: "Messages", path: "/admin/mother-messages" },
  //   ],
  // },
  {
    title: "Services",
    icon: 'serviceProviders',
    path: "/admin/services",
    submenu: [
      { title: "View All", path: "/admin/services" },
      // { title: "Performance", path: "/admin/services/performance" },
      // {
      //   title: "Disputes and Issues",
      //   path: "/admin/services/disputes",
      // },
    ],
  },
  {
    title: "Healthcare Providers",
    icon: 'healthcareProviders',
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
      // {
      //   title: "Caseloads Summaries",
      //   path: "/admin/healthcare-provider/caseloads",
      // },
    ],
  },
  {
    title: "Content",
    icon: 'content',    
    path: "/admin/content",
    submenu: [
      { title: "Blog Articles", path: "/admin/content/blog" },
      // { title: "Educational Resources", path: "/admin/content/resource" },
      // { title: "Promotional Banners", path: "/admin/content/promotions" },
    ],
  },
  {
    title: "Marketplace",
    icon: 'marketPlace',
    path: "/admin/marketplace",
    submenu: [
      { title: "Manage Products", path: "/admin/marketplace/manage-product" },
      {
        title: "Orders",
        path: "/admin/marketplace/orders",
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
    icon: 'supportTickets',
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
    icon: 'communities',
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
  const navigate = useNavigate()

  const { pathname } = useLocation();
  
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleMenu = (index) => {
    setOpenMenu((prev) => (prev === index ? null : index));
  };

  return (
    <>
      {/* Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-[999] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-[#6F3DCB] z-[1000]
        transform transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="bg-white rounded-lg px-3 py-2">
            <img src={logoFull} alt="LavenderCare" className="h-7" />
          </div>

          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileOpen(false)}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-6 px-3 space-y-1">
          {sidebarMenu.map((item, index) => {
            const isActive = pathname.startsWith(item.path);
            const isOpen = openMenu === index;

            return (
              <div key={index}>
                {/* Main item */}
                <button
                  onClick={() =>
                    item.submenu.length ? toggleMenu(index) : navigate(item.path)
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${isActive ? "bg-white text-[#6F3DCB]" : "text-white hover:bg-white/10"}`}
                >
                  <Icons
                    name={item.icon}
                    color={isActive ? "#6F3DCB" : "#FFF"}
                  />

                  <span className="flex-1 text-sm font-medium text-left">
                    {item.title}
                  </span>

                  {item.submenu.length > 0 && (
                    <FaChevronDown
                      className={`transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      size={12}
                    />
                  )}
                </button>

                {/* Submenu */}
                {item.submenu.length > 0 && isOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.submenu.map((sub, i) => (
                      <NavLink
                        key={i}
                        to={sub.path}
                        end
                        className={({ isActive }) =>
                          `block px-4 py-2 text-sm rounded-lg transition
                          ${
                            isActive
                              ? "bg-white/20 text-white font-medium"
                              : "text-white/80 hover:text-white hover:bg-white/10"
                          }`
                        }
                      >
                        {sub.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-5 left-5 z-[1100] lg:hidden bg-white rounded-lg p-2 shadow"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 36 36"
          fill="none"
        >
          <path
            d="M4 9h28M4 18h28M4 27h28"
            stroke="#6F3DCB"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </>
  );
}

export default Sidebar;
