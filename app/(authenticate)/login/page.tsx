"use client";
import "../css/style.css"
import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Imane from "@/public/image/transparent-logo.png";
import UserService from "@/service/user";
import Loading from "@/components/loading/Loading";
export default function LoginPage() {

  const [identifier, setIdentifier] = useState("");
  const [identifiertouched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setTouched(true);
    setLoading(true);

    if (identifier.trim() === "") return;
    try {
      const response = await UserService.login(identifier, password);
      // Lưu token vào localStorage
      localStorage.setItem("token", response.data.token);
      setError("");
      window.location.href = "/";
    } catch (error: any) {
      if (error) {
        setError(error.message);
      } else {
        setError("Hệ thống đang bao trì");
      }
      return;
    }
  }

  const isError = identifiertouched && identifier.trim() === "";


  return (
    <div className="w-full h-screen">
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}
      <section className="flex justify-center items-center h-screen bg-gray-100">
        <div className="max-w-lg w-full rounded p-6 space-y-4 mt-[-50]">
          <div className="flex flex-col items-center text-center">
            <Image
              src={Imane}
              alt="Logo"
              width={200}
            />
            {/* <p className="text-2xl mt-[-30] font-semibold text-black">Sign In</p> */}
          </div>
          <div className="bg-white mt-[-40] p-6 space-y-4">
            <div className="flex-col items-center text-center">
              <h1 className="text-3xl font-bold">Log in to NexChat 1</h1>
              {error && <p className="text-red-500 text-center font-bold leading-9 tracking-tight text-lg max-w-md mx-auto">{error}</p>}
            </div>
            <div className="mt-3 relative">
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={`mt-1 p-2 w-full border rounded-md border-zinc-800 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300
                  ${isError ? "border-red-600 input-error error-icon" : "border-gray-300"}`}
                type="text" placeholder="Email address or phone number" />
              {isError && (
                <div className="absolute right-3 mt-0.5 top-1/4 -translate-y-1/2 text-gray-600">
                  <div className="w-4 h-4 bg-red-600 text-white flex items-center justify-center rounded-full text-xs cursor-pointer group">
                    !
                  </div>
                </div>
              )}
              {isError && (
                <div className="z-50 font-medium text-red-600 text-sm py-1 ">
                  WThe email address or mobile number you entered isn't connected to an account.
                </div>
              )}
            </div>
            <div className="mt-3">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md border-zinc-800 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" placeholder="Password" />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 mt-0.5 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? (
                    /* ICON mắt mở */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    /* ICON mắt đóng */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.81 21.81 0 015.06-5.94M9.88 4.12A10.94 10.94 0 0112 5c7 0 11 7 11 7a21.81 21.81 0 01-2.53 3.68" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <button onClick={handleSubmit} className="w-full mt-2 mb-2 py-3 bg-blue-600 hover:bg-blue-700 rounded text-lg font-bold text-gray-50 transition duration-200">Sign In</button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-row items-center">
                <a className="ml-0 text-lg font-normal text-red-600" href="/register">Register</a>
              </div>
              <div>
                <a className="text-lg text-blue-600 hover:underline" href="#">Forgot password?</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
