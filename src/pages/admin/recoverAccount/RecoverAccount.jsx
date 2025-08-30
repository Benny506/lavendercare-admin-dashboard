import React from "react";
import banner from "../components/ui/authBanner.svg";
import { Link } from "react-router-dom";

function RecoverAccount() {
  return (
    <div className="w-full h-screen lg:flex lg:items-center">
      <img
        src={banner}
        className="hidden lg:block h-full object-cover lg:w-[50%]"
        alt=""
      />

      <div className="flex  flex-col h-screen lg:h-auto gap-6 mx-auto">
        <div className=" flex flex-col gap-2">
          <h2 className="text-3xl lg:text-4xl font-bold">Recover your account</h2>
          <p className="caret-(--gray-50) text-sm sm:text-base px-3">
          </p>
        </div>

        <form className="lg:w-max px-[14px] lg:px-0">
          <div className="flex flex-col gap-6">
            <label htmlFor="email_address" className="flex flex-col gap-1">
              <p>Email Address</p>
              <input
                className="py-[10px] w-full pl-[40px] px-[14px] border border-(--grey-200) rounded-md"
                type="email"
                required
                id="email_address"
                placeholder="Type your email address"
              />
            </label>
          </div>

          <div className="flex flex-col py-8 w-full gap-6">
            <input
              type="submit"
              className="py-4 hover:cursor-pointer lg:px-[190px] text-white rounded-full bg-(--primary-500)"
              value="Send OTP"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecoverAccount;
