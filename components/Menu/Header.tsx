// components/Header.tsx (Client Component)
"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Menu from "./Menu";
import MenuNgang from "./Menu_ngang";
import Auth from "@/service/user";
import InitAuth from "@/Initialize-once/InitAuth";
import InitSocket from "@/Initialize-once/socket-io";
export default function Header() {
  const pathname = usePathname();

  // Ẩn menu nếu đang ở /login
  if (pathname.startsWith("/login")) return null;
  if (pathname.startsWith("/register")) return null;

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // const fetchToken = async () => {
  //     try {
  //         const data = await Auth.gettoken();
  //         const { username, avatarUrl } = data.data.user;
  //         const name = data.data.user.username;
  //         setUsername(username);
  //         setAvatarUrl(avatarUrl);
  //     } catch (error) {

  //     }
  // }

  // useEffect(() => {
  //     fetchToken();
  // }, []);

  const firstLetterOfLastName =
      username
          ?.trim()
          .split(" ")
          .pop()
          ?.charAt(0)
          ?.toUpperCase() || "";

  return (
    <>
      <InitAuth/>
      <InitSocket/>
      <MenuNgang />
      {/* <Menu /> */}
    </>
  );
}
