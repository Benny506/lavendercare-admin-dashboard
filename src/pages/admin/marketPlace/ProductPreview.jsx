import React, { useState } from 'react';

function ProductPreview() {
  const [qty, setQty] = useState(1);
  return (
    <div className="w-full px-2 md:px-8 py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 mb-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.66667 14.1663H13.3333M9.18141 2.30297L3.52949 6.6989C3.15168 6.99276 2.96278 7.13968 2.82669 7.32368C2.70614 7.48667 2.61633 7.67029 2.56169 7.86551C2.5 8.0859 2.5 8.32521 2.5 8.80384V14.833C2.5 15.7664 2.5 16.2331 2.68166 16.5896C2.84144 16.9032 3.09641 17.1582 3.41002 17.318C3.76654 17.4996 4.23325 17.4996 5.16667 17.4996H14.8333C15.7668 17.4996 16.2335 17.4996 16.59 17.318C16.9036 17.1582 17.1586 16.9032 17.3183 16.5896C17.5 16.2331 17.5 15.7664 17.5 14.833V8.80384C17.5 8.32521 17.5 8.0859 17.4383 7.86551C17.3837 7.67029 17.2939 7.48667 17.1733 7.32368C17.0372 7.13968 16.8483 6.99276 16.4705 6.69891L10.8186 2.30297C10.5258 2.07526 10.3794 1.9614 10.2178 1.91763C10.0752 1.87902 9.92484 1.87902 9.78221 1.91763C9.62057 1.9614 9.47418 2.07526 9.18141 2.30297Z" stroke="#8B8B8A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-xs text-gray-400">Marketplace</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_1918_35894)"><path d="M6.66656 4L5.72656 4.94L8.7799 8L5.72656 11.06L6.66656 12L10.6666 8L6.66656 4Z" fill="#8B8B8A" /></g>
          <defs><clipPath id="clip0_1918_35894"><rect width="16" height="16" fill="white" /></clipPath></defs>
        </svg>
        <span className="text-xs text-gray-400">Marketplace</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_1918_35894)"><path d="M6.66656 4L5.72656 4.94L8.7799 8L5.72656 11.06L6.66656 12L10.6666 8L6.66656 4Z" fill="#8B8B8A" /></g>
          <defs><clipPath id="clip0_1918_35894"><rect width="16" height="16" fill="white" /></clipPath></defs>
        </svg>
        <span className="text-xs text-(--primary-500) font-semibold">Yoga Mat</span>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center max-w-3xl mx-auto">
        <div className="w-full flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 flex justify-center items-center">
            <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" stroke="#8B8B8A" strokeWidth="2" rx="4"/><path stroke="#8B8B8A" strokeWidth="2" d="M8 15l4-4 4 4"/><circle cx="12" cy="10" r="2" stroke="#8B8B8A" strokeWidth="2"/></svg>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Yoga Mat</h2>
            <div className="text-lg font-semibold mb-2">$ 15.99</div>
            <div className="text-gray-500 mb-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore</div>
            <div className="flex items-center gap-2 mb-4">
              <button className="border border-gray-300 rounded px-2" onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>-</button>
              <span className="px-2">{qty}</span>
              <button className="border border-gray-300 rounded px-2" onClick={() => setQty(qty + 1)}>+</button>
              <button className="ml-4 bg-gray-200 rounded px-4 py-2 font-semibold">Add to cart</button>
            </div>
            <div className="text-xs text-gray-600">CATEGORY: Health</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPreview;
