import React from "react";
import banner from "../components/ui/authBanner.svg";
import email from "../components/ui/mail.png";
import { Link } from "react-router-dom";

function VerifyEmail() {
  return (
    <div className="w-full h-screen lg:flex lg:items-center">
      <img
        src={banner}
        className="hidden lg:block h-full object-cover lg:w-[50%]"
        alt=""
      />

      <div className="flex  flex-col h-screen lg:h-auto justify-center gap-6 mx-auto">
        <form className="lg:w-max px-[14px]">
          <div className="flex justify-center flex-col gap-6">
            <img
              src={email}
              className="w-[40px] lg:w-[80px] mx-auto"
              alt="logo for email"
            />

            <h2 className="text-3xl pt-[24px] leading-2 text-center text-(--grey-800) lg:text-4xl font-bold">
              Email Verification
            </h2>

            <div className="flex flex-col">
              <span className="text-(--grey-500) text-center">
                Enter the 6-digit code we have sent to
              </span>
              <span className="font-semibold text-center">
                janed****@gmail.com
              </span>
            </div>

            <div className="pt-8 pb-2 w-full">
              <input
                type="submit"
                className="py-4 hover:cursor-pointer lg:px-[190px] text-white rounded-full bg-(--primary-500)"
                value="Continue"
              />
            </div>

            <p className="text-center">
              i entered the wrong Email.{" "}
              <Link
                to="/admin/create-account"
                className="font-semibold text-(--primary-500)"
              >
                Change Email
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmail;
