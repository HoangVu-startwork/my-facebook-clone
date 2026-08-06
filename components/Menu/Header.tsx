// components/Header.tsx (Client Component)
"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import MenuNgang from "./Menu_ngang";
import InitAuth from "@/Initialize-once/InitAuth";
import InitSocket from "@/Initialize-once/socket-io";
import MobileDrawer from "./Phone_menu/MobileDrawer";
import Phone_menu from "./Phone_menu/Phone_menu";
import { Screensize } from "@/components/Size_tracking/Size"

export default function Header() {
  const pathname = usePathname();

  // Ẩn menu nếu đang ở /login
  if (pathname.startsWith("/login")) return null;
  if (pathname.startsWith("/register")) return null;

  const [open, setOpen] = useState(false);
  const isMobile = Screensize(1024);
  return (
    <>
      <InitAuth />
      <InitSocket />
      {!isMobile && <MenuNgang />}
      {isMobile && (
        <>
          <Phone_menu
            onOpenMenu={() => setOpen(true)}
          />

          <MobileDrawer
            open={open}
            onClose={() => setOpen(false)}
          />
        </>
      )}
      {/* <Menu /> */}
    </>
  );
}
