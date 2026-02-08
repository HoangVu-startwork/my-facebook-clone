"use client";
import "../css/style.css"
import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Imane from "@/public/image/transparent-logo.png";
import UserService from "@/service/user";

export default function LoginPage() {

  const [identifier, setIdentifier] = useState("");
  const [identifiertouched, setTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setTouched(true);

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
              <h1 className="text-xl font-bold">Log in to NexChat</h1>
              {error && <p className="text-red-500 text-center font-bold leading-9 tracking-tight text-lg max-w-md mx-auto">{error}</p>}
            </div>
            <div className="mt-2 relative">
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
                  WThe email address or mobile number you entered isn't connected to an account. <span className="font-bold">Find your account and log in.</span>
                </div>
              )}
            </div>
            <div className="mt-2">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md border-zinc-800 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" type="text" placeholder="Password" />
            </div>
            <div>
              <button onClick={handleSubmit} className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold text-gray-50 transition duration-200">Sign In</button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-row items-center">
                <input type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <label className="ml-2 text-sm font-normal text-gray-600">Remember me</label>
              </div>
              <div>
                <a className="text-sm text-blue-600 hover:underline" href="#">Forgot password?</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
