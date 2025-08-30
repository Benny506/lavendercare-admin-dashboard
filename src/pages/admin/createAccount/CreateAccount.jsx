import React from "react";
import banner from "../components/ui/authBanner.svg";

function CreateAccount() {
  return (
    <div className="w-full h-screen lg:flex lg:items-center">
      <img
        src={banner}
        className="hidden lg:block h-full object-cover lg:w-[50%]"
        alt=""
      />

      <div className="flex  flex-col h-screen lg:h-auto justify-center gap-6 mx-auto">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-3xl lg:text-4xl font-bold">Create Admin Account</h2>
          <p className="text-(--gray-500) w-[382px] mx-auto text-sm sm:text-base px-3">
          Become a lavendercare Admin by filling in your information below
          </p>
        </div>

        <form className="lg:w-max px-[14px]">
          <div className="flex justify-center flex-col gap-6">
            <label htmlFor="email_address" className="flex flex-col gap-1">
              <p>Email Address</p>
              <input
                className="py-[10px] w-full px-[14px] border border-(--grey-200) rounded-md"
                type="email"
                required
                id="email_address"
                placeholder="youremail@gmail.com"
              />
            </label>

            <label htmlFor="email_address" className="flex flex-col gap-1">
              <p>Phone Number</p>
              <input
                className="py-[10px] w-full px-[14px] border border-(--grey-200) rounded-md"
                type="number"
                required
                id="email_address"
                placeholder="+234"
              />
            </label>

            <label htmlFor="password" className="flex flex-col gap-1">
              <p>Password</p>
              <input
                className="py-[10px] w-full px-[14px] border border-(--grey-200) rounded-md"
                type="password"
                required
                id="password"
                placeholder="Type your password"
              />
            </label>

            <label htmlFor="confirmPassword" className="flex flex-col gap-1">
              <p>confirm Password</p>
              <input
                className="py-[10px] w-full px-[14px] border border-(--grey-200) rounded-md"
                type="password"
                required
                id="password"
                placeholder="Re-Type password"
              />
            </label>
          </div>

          <div className="py-8 w-full">

            <input
              type="submit"
              className="py-4 hover:cursor-pointer lg:px-[190px] text-white rounded-full bg-(--primary-500)"
              value="Create"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;
