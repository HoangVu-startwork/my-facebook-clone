"use client";

import { useState, useRef, useEffect } from "react";
import { UserPlus, UserRoundCheck, Settings, UserCog, Users, UsersRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cloneElement } from "react";
import '../css/menu_friends.css'

export default function FriendsMenu() {
  const pathname = usePathname();
  const items = [
    { label: "Trang chủ", path: "/ketban/friends", icon: <UserPlus className="h-6 w-6 text-white" /> },
    { label: "Lời mời kết bạn", path: "/ketban/requests", icon: <UserPlus className="h-6 w-6 text-gray-700" /> },
    { label: "Gợi ý", path: "/ketban/suggestions", icon: <UserPlus className="h-6 w-6 text-gray-700" /> },
    { label: "Tất cả bạn bè", path: "/ketban/all", icon: <UserPlus className="h-6 w-6 text-gray-700" /> },
    { label: "Sinh nhật", path: "/ketban/birthday", icon: <UserPlus className="h-6 w-6 text-gray-700" /> },
  ];

  const itemsdt = [
    { label: "Lời mời kết bạn", path: "/ketban/requests", icon: <UserPlus className="h-6 w-6 text-gray-700" /> },
    { label: "Tất cả bạn bè", path: "/ketban/friends", icon: <UserPlus className="h-6 w-6 text-gray-700" /> },
    { label: "Sinh nhật", path: "/ketban/birthday", icon: <UserPlus className="h-6 w-6 text-gray-700" /> },
  ]

  return (
    <>
      <div className="show2_manghinh_600">
        <h2 className="text-2xl pl-3 font-bold mb-3">Bạn bè</h2>
        <div className="mt-5 pl-3 w-full mb-3 gap-2 flex show2_manghinh_600_flex">
          {itemsdt.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <div key={index}>
                <Link
                  href={item.path}
                  key={index}
                  className={`items-center gap-2 pt-2 pl-5 pb-2 pr-5 rounded-lg hover:bg-blue-600 transition 
                    ${isActive ? "bg-blue-100 text-white" : "bg-gray-300 text-gray-800"}
                  `}
                >
                  <span className="font-medium text-sm text-gray-800">{item.label}</span>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
      <div className="show_manghinh_600 shadow pt-3 h-full w-full">
        <h2 className="text-2xl pl-3 font-bold mb-3">Bạn bè</h2>
        <div className="space-y-1 h-full">
          {items.map((item, index) => {
            const isActive = pathname === item.path;
            const icon = cloneElement(item.icon, {
              className: `h-6 w-6 ${isActive ? "text-white" : "text-gray-700"}`
            });
            return (
              <div key={index}>
                <Link
                  href={item.path}
                  key={index}
                  className={`flex items-center gap-2 pt-3 pl-3 pb-3 pr-1 rounded-lg hover:bg-blue-600 transition $c{
                isActive ? "bg-blue-100" : ""
              }`}
                >
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-full ${isActive ? "bg-blue-600" : "bg-gray-200"
                      }`}
                  >
                    {icon}
                  </div>
                  <span className="font-medium text-gray-800">{item.label}</span>
                  {!isActive && <span className="ml-auto text-gray-500">&gt;</span>}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
}
