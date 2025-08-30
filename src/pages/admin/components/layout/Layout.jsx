import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="flex w-full">
      <Sidebar />

      <div className="flex-col relative w-full lg:w-auto flex">
        <Header />

        <div className="bg-(--gray-100) px-[12px] lg:px-[32px] w-full lg:w-[calc(100vw-260px)] h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
