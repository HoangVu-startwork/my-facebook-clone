"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Users,
  CirclePlus,
  Bell,
  Menu,
} from "lucide-react";

interface Props {
  onOpenMenu: () => void;
}

export default function BottomNavigation({ onOpenMenu }: Props) {
  const pathname = usePathname();

  const menus = [
    {
      href: "/",
      icon: House,
    },
    {
      href: "/friends",
      icon: Users,
    },
    {
      href: "/create",
      icon: CirclePlus,
    },
    {
      href: "/notifications",
      icon: Bell,
      badge: 3,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg">
      <div className="grid h-16 grid-cols-5">
        {menus.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center justify-center"
            >
              <Icon
                size={26}
                className={`transition ${
                  active
                    ? "text-blue-600 scale-110"
                    : "text-gray-500"
                }`}
              />

              {item.badge && (
                <span className="absolute translate-x-1/1 -translate-y-1/2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <button
          onClick={onOpenMenu}
          className="flex items-center justify-center"
        >
          <Menu
            size={28}
            className="text-gray-500"
          />
        </button>
      </div>
    </nav>
  );
}