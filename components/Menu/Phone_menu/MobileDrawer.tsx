"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  User,
  MessageCircle,
  Users,
  Image,
  Settings,
  LogOut,
  X,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawer({
  open,
  onClose,
}: Props) {
  const menus = [
    {
      href: "/profile",
      icon: User,
      label: "Trang cá nhân",
    },
    {
      href: "/messages",
      icon: MessageCircle,
      label: "Tin nhắn",
    },
    {
      href: "/friends",
      icon: Users,
      label: "Bạn bè",
    },
    {
      href: "/photos",
      icon: Image,
      label: "Ảnh",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Cài đặt",
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed right-0 top-0 z-50 h-full w-80 bg-white shadow-xl"
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-bold text-lg">
                Menu
              </h2>

              <button onClick={onClose}>
                <X />
              </button>
            </div>

            <div className="p-3">
              {menus.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-4 rounded-xl p-3 hover:bg-gray-100"
                  >
                    <Icon size={22} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <button className="mt-3 flex w-full items-center gap-4 rounded-xl p-3 hover:bg-red-50 text-red-600">
                <LogOut size={22} />
                Đăng xuất
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}