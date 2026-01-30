import React from "react";
import NavComponent from "./components/NavComponent";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails, getUserDetailsState } from "../../../redux/slices/userDetailsSlice";
import Button from "../components/ui/Button";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";
import supabase from "../../../database/dbInit";

function General() {

  const dispatch = useDispatch()

  const profile = useSelector(state => getUserDetailsState(state).profile)

  const userLogout = async () => {
    dispatch(appLoadStart())
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Logout error")
      console.error("Logout error:", error.message);
    }

    dispatch(appLoadStop())

    if(!error){
      dispatch(clearUserDetails())
      toast.success("Logged out!")
    }
  };


  return (
    <div className="pt-6 w-full min-h-screen">
      <h2 className="text-lg sm:text-xl font-bold mb-4">Settings</h2>
      <NavComponent />

      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-semibold mb-2">Admin Info</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 pt-4 w-full ">
              {/* platform name */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-medium">Username</label>
                <input
                  type="text"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  value={profile?.username}
                  readOnly
                />
              </div>
            </div>

            <div className="flex items-start justify-start mt-5">
              <Button onClick={userLogout} variant="danger">
                Logout
              </Button>
            </div>
          </div>
        </div>


        {/* Actions */}
        {/* <div className="flex gap-2 justify-end mt-4">
          <button className="py-2 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium text-xs sm:text-sm">
            Cancel
          </button>
          <button className="py-2 px-4 rounded-lg bg-[#703dcb] text-white font-medium text-xs sm:text-sm">
            Save Changes
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default General;
