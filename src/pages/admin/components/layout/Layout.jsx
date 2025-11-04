import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="flex w-full h-screen overflow-hidden"> {/* ✅ lock overall height */}
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden"> {/* ✅ prevent nested scroll fights */}
        <Header />

        <div className="flex-1 bg-[var(--gray-100)] px-[12px] lg:px-[32px] overflow-y-auto"> {/* ✅ scroll only here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
