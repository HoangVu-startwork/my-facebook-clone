"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import MenuKetban from "@/components/Friends_home/Menu_friends";
import "./style.css";

export default function KetbanLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Các đường dẫn cần ẩn menu
  const hiddenPaths = [
    "/ketban/requests",
  ];

  // Kiểm tra xem pathname có bắt đầu bằng một trong các hiddenPaths không
  const hideMenu = hiddenPaths.some(path => pathname.startsWith(path));

  return (
    <div className="">
      <div className="ketban_layout_550">
        {!hideMenu && (
          <>
            <div className="menu_ketban w-full mt-15 h-full">
              <MenuKetban />
            </div>
            <div className="hienthi_ketban p-3 h-full overflow-auto">
              {children}
            </div>
          </>
        )}
      </div>
        {!hideMenu && (
          <div className="flex gap-5 h-full pr-2 ketban_layout_551">
            <div className="menu_ketban mt-15">
              <MenuKetban />
            </div>
            <div className="hienthi_ketban mt-18 flex-1 overflow-auto">
              {children}
            </div>
          </div>
        )}
        {hideMenu && (
          <>
            <div className="h-full">
              {children}
            </div>
          </>
        )}
      </div>

  );
}
