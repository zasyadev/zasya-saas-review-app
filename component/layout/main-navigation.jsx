import Link from "next/link";
import React, { useState } from "react";
import { signOut } from "next-auth/client";

function MainNavigation({ user }) {
  const logoutHandler = () => {
    signOut({
      redirect: false,
      callbackUrl: "/auth/login",
    });
  };
  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div>
                <Link href="/">
                  <p href="#" className="flex items-center py-4 px-2">
                    <span className="font-semibold text-gray-500 text-lg">
                      Review App
                    </span>
                  </p>
                </Link>
              </div>

              <div className="hidden md:flex items-center space-x-1">
                <Link href="/">
                  <p className="py-4 px-2 text-green-500 border-b-4 border-green-500 font-semibold cursor-pointer">
                    Home{" "}
                  </p>
                </Link>
                <Link href="">
                  <p className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300 cursor-pointer">
                    Services
                  </p>
                </Link>
                <a
                  href=""
                  className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
                >
                  About
                </a>
                <a
                  href=""
                  className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"
                >
                  Contact Us
                </a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3 ">
              {user?.id ? (
                <Link href="/">
                  <p
                    className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300 cursor-pointer"
                    onClick={logoutHandler}
                  >
                    Log Out
                  </p>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <p className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300 cursor-pointer">
                      Log In
                    </p>
                  </Link>
                  <Link href="/auth/register">
                    <p className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300 cursor-pointer">
                      Sign Up
                    </p>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default MainNavigation;
