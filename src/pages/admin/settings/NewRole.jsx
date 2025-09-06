import React from "react";

function NewRole() {
  return (
    <div className="pt-6 mb-8">
      {/* add new role title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Add New Role</h2>

        {/*  */}
        <div className="flex gap-1 items-center">
          <button className="py-2 px-4 text-[14px] text-gray-400">cancel</button>
          <button className="py-2 px-4 text-[14px] bg-(--primary-500) text-white rounded-sm">
            save role
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-2 md:p-6 w-full relative animate-fadeIn">
        <p className="text-base font-bold mb-4">Basic Information</p>
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Role Name</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              placeholder="e.g. Support Manager"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Role Description
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              placeholder="Define the responsibilities for this role"
              rows={5}
            ></textarea>
            <span className="text-[12px] text-[#4D4D4D]">
              Optional but recommended for clarity
            </span>
          </div>
          <div>
            <label className="block text-xl font-semibold mb-4">
              Permissions
            </label>

            <table className="w-full overflow-x-auto border border-gray-200 rounded-[16px] text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2">Module / Feature</th>
                  <th className="p-2">View</th>
                  <th className="p-2">Create</th>
                  <th className="p-2">Edit</th>
                  <th className="p-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "Users",
                  "Service Providers",
                  "Healthcare Providers",
                  "Content",
                  "Marketplace",
                  "Orders & Transactions",
                  "Support Tickets",
                  "Analytics",
                  "Communities",
                  "Settings",
                ].map((mod, idx) => (
                  <tr key={mod}>
                    <td className="p-2 flex items-center gap-1 font-medium">
                      <input type="checkbox" />
                      {mod}
                    </td>
                    <td className="p-2 text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="p-2 text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="p-2 text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="p-2 text-center">
                      <input type="checkbox" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <label className="block text-[18px] font-semibold mb-4">
              Assign Users (Optional)
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              placeholder="Search users by name or email"
            />
          </div>
          <div className="flex gap-2 justify-between mt-4">
            <button
              type="button"
              className="py-2 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium text-xs sm:text-sm"
            >
              Back
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-lg bg-(--primary-500) text-white font-medium text-xs sm:text-sm"
            >
              Save Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewRole;
