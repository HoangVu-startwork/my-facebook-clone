// components/Header.tsx (Client Component)
"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import MenuNgang from "./Menu_ngang";
import InitAuth from "@/Initialize-once/InitAuth";
import InitSocket from "@/Initialize-once/socket-io";
export default function Header() {
  const pathname = usePathname();

  // Ẩn menu nếu đang ở /login
  if (pathname.startsWith("/login")) return null;
  if (pathname.startsWith("/register")) return null;

  return (
    <>
      <InitAuth/>
      <InitSocket/>
      <MenuNgang />
      {/* <Menu /> */}
    </>
  );
}
