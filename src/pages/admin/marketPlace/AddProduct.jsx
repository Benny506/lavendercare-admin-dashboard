import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  // Form state can be added here if needed
  const navigate = useNavigate();
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
        <span className="text-xs text-gray-400">New Product</span>
      </div>
      <h2 className="text-xl md:text-2xl font-bold mb-2">Add New Product</h2>
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div>
            <label className="block font-semibold mb-1">Product Name</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Enter Product name" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Product Description</label>
            <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Enter Product name" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Upload Image</label>
            <div className="w-full border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center py-8 cursor-pointer text-center text-gray-400">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="#8B8B8A" strokeWidth="2" d="M12 16v-4m0 0V8m0 4h4m-4 0H8"/><rect width="20" height="20" x="2" y="2" stroke="#8B8B8A" strokeWidth="2" rx="4"/></svg>
              <span>Click to upload <span className="text-(--primary-500)">or drag and drop</span></span>
              <span className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</span>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Product Price</label>
            <div className="flex gap-2">
              <select className="border border-gray-200 rounded-lg px-2 py-2 bg-white text-gray-700">
                <option>US</option>
              </select>
              <input className="flex-1 border border-gray-200 rounded-lg px-3 py-2" placeholder="Price" />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">No of Stock</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Number of stock" />
          </div>
        </div>
        <div className="w-full md:w-64 flex flex-col gap-4">
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
            <span className="font-semibold mb-2">Publish</span>
            <div className="flex gap-2 mb-2">
              <button className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700">Save Draft</button>
              <button className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700" onClick={() => navigate('/admin/marketplace/yoga-mat')}>Preview</button>
            </div>
            <button className="bg-(--primary-500) hover:bg-(--primary-600) text-white rounded-lg px-4 py-2 font-semibold transition">Publish</button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
            <span className="font-semibold mb-2">Product categories</span>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2"><input type="checkbox" /> Health</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Wellness</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Medical</label>
            </div>
            <button className="text-(--primary-500) text-xs text-left mt-2">+ Add new category</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
