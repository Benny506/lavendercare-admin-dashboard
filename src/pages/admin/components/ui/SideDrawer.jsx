import React, { useState } from "react";
import { MdClose } from "react-icons/md";

export default function SideDrawer({ trigger, open, setOpen, children, title }) {
  return (
    <>
      {/* Trigger outside */}
      <div onClick={() => setOpen(true)} className="inline-block">
        {trigger}
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <MdClose className="w-5 h-5" color="#FFF" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
          {children}
        </div>
      </div>
    </>
  );
}
