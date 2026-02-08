"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronRight, LogOut, Settings, HelpCircle, Monitor, MessageSquare } from "lucide-react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Đóng menu khi nhấn ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Nút avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white"
      >
        V
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-xl p-3 z-[999]">
          {/* Profile */}
          <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center">
              V
            </div>
            <div>
              <p className="font-semibold">Trần Hoàng Vũ</p>
              <p className="text-sm text-gray-500">Xem tất cả trang cá nhân</p>
            </div>
          </div>

          <div className="h-[1px] bg-gray-200 my-2"></div>

          {/* Items */}
          <MenuItem icon={<Settings size={20} />} label="Cài đặt & quyền riêng tư" />
          <MenuItem icon={<HelpCircle size={20} />} label="Trợ giúp & hỗ trợ" />
          <MenuItem icon={<Monitor size={20} />} label="Màn hình & trợ năng" />
          <MenuItem icon={<MessageSquare size={20} />} label="Đóng góp ý kiến" />
          
          <MenuItem icon={<LogOut size={20} />} label="Đăng xuất" />

          <div className="text-xs text-gray-500 px-3 mt-2">
            Quyền riêng tư · Điều khoản · Quảng cáo · Cookie · Xem thêm
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
      <div className="flex items-center gap-3">
        <span>{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight size={20} />
    </div>
  );
}
