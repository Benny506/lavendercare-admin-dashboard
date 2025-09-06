import React from 'react';

function CreateCommunity() {
  return (
    <div className="p-2 sm:p-4 md:p-6 w-full min-h-screen bg-[#F8F9FB]">
      <div className="mb-2 sm:mb-4 flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        <span className="text-gray-400">Communities</span>
        <span className="text-gray-400">/</span>
        <span className="text-primary font-medium">Create Community</span>
      </div>
      <h2 className="text-lg sm:text-xl font-bold mb-4">Create Community</h2>
      <div className="bg-white rounded-xl shadow-sm p-4 max-w-2xl mx-auto">
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Community Name</label>
            <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="Enter community name" required />
            <span className="text-xs text-red-500">Community name is required</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Short Handle / Slug</label>
            <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="e.g. newmothers, lactation" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="Describe what this community is about..." rows={3}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Visibility</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="visibility" value="Public" className="accent-primary" defaultChecked /> Public
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="visibility" value="Private" className="accent-primary" /> Private
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Group Type</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" required>
              <option value="">Select group type</option>
              <option value="support">Support</option>
              <option value="education">Education</option>
              <option value="local">Local</option>
            </select>
            <span className="text-xs text-red-500">Please select a community type</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Initial Moderators</label>
            <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="Add moderators" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cover Image</label>
            <div className="flex flex-col items-center gap-2 border border-gray-200 rounded-lg p-4">
              <span className="text-xs text-gray-400">Upload file</span>
              <input type="file" className="hidden" />
              <button type="button" className="bg-gray-100 px-4 py-2 rounded text-xs">Upload file</button>
              <span className="text-xs text-gray-400">Recommended: 1200x400px, JPG or PNG</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Community Rules</label>
            <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="Enter community rules..." rows={2}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Launch Options</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="launch" value="immediate" className="accent-primary" defaultChecked /> Launch Immediately
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="launch" value="scheduled" className="accent-primary" /> Schedule Launch Date
              </label>
            </div>
            <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none mt-2" />
          </div>
          <div className="flex gap-2 mt-6 justify-end">
            <button type="button" className="py-2 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium text-xs sm:text-sm">Cancel</button>
            <button type="submit" className="py-2 px-4 rounded-lg bg-primary text-white font-medium text-xs sm:text-sm">Create Community</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCommunity;
