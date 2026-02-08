"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
    Search,
    Home,
    MonitorPlay,
    ShoppingBag,
    Users,
    AppWindow,
    Bell,
    MessageCircle,
    Settings,
    HelpCircle,
    Monitor,
    MessageSquare,
    LogOut,
    ChevronRight,
} from "lucide-react";
import { Calendar, LayoutGrid, Newspaper, PlaySquare, Gamepad, Store } from "lucide-react";
import "../css/menu.css";
import Auth from "@/service/user";
import CreatePost from "@/components/Create/Create-post"
import Link from "next/link";
import { useAuthStore } from "@/service/service-once/AuthState"

export default function bookHeader() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="menu_nexchat w-full bg-white shadow h-14 flex items-center px-4 justify-between fixed top-0 left-0 z-50">

            {/* LEFT: Logo + Search */}
            <div className="menu_nexchat_left flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">f</span>
                </div>

                <div className="search_box bg-gray-100 rounded-full px-3 py-2 flex items-center gap-2 w-60">
                    <Search size={18} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm trên Facebook"
                        className="bg-transparent outline-none text-sm w-full"
                    />
                </div>
            </div>

            {/* CENTER: Navigation Icons */}

            <div className="menu_nexchat_center flex items-center gap-10 text-gray-500">
                <Link href="/">
                    <NavIcon
                        icon={<Home size={24} />}
                        active={pathname === "/"}
                    />
                </Link>
                <Link href="/video">
                    <NavIcon
                        icon={<MonitorPlay size={24} />}
                        active={pathname === "/video"}
                    />
                </Link>
                <NavIcon
                    icon={<ShoppingBag size={24} />}
                    active={pathname === "/video_video"}
                />

                <NavIcon
                    icon={<Users size={24} />}
                    active={pathname === "/size"}
                />
            </div>

            {/* RIGHT: Actions */}
            <div className="menu_nexchat_right flex items-center gap-3">
                {/* <CircleIcon icon={<AppWindow size={20} />} /> */}
                <div onClick={() => setMenuOpen(true)}>
                    <CircleIcon icon={<AppWindow size={20} />} />
                </div>
                <CircleIcon icon={<MessageCircle size={20} />} />
                <CircleIcon icon={<Bell size={20} />} badge={1} />

                {/* Avatar Menu */}
                <UserMenu />
            </div>
            {menuOpen && (
                <MenuOverlay onClose={() => setMenuOpen(false)} />
            )}
        </div>
    );
}

function NavIcon({ icon, active = false }: { icon: React.ReactNode; active?: boolean }) {
    return (
        <div className="relative cursor-pointer flex flex-col items-center">
            <div
                className={`p-2 rounded-md ${active ? "text-[#1877F2]" : "hover:bg-gray-100"
                    }`}
            >
                {icon}
            </div>
            {active && <div className="w-12 h-1 bg-[#1877F2] rounded-full absolute -bottom-2"></div>}
        </div>
    );
}

function CircleIcon({ icon, badge }: { icon: React.ReactNode; badge?: number }) {
    return (
        <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300">
                {icon}
            </div>

            {badge && (
                <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {badge}
                </div>
            )}
        </div>
    );
}

/* --------------------- */
/* USER MENU (Avatar)    */
/* --------------------- */
function capitalizeWords(str: string | undefined) {
    if (!str) return "";
    return str
        .split(" ")
        .filter(Boolean) // bỏ khoảng trắng thừa
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}
function UserMenu() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Lấy từ ZUSTAND
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const logout = useAuthStore((state) => state.logout);

    // if (loading) return null;

    const username = user?.username || "";
    const avatarUrl = user?.avaturl;

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const firstLetterOfLastName =
        username
            ?.trim()
            .split(" ")
            .pop()
            ?.charAt(0)
            ?.toUpperCase() || "";

    return (
        <div className="relative" ref={menuRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full text-xl font-semibold bg-black text-white flex items-center justify-center cursor-pointer overflow-hidden uppercase"
            >
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    firstLetterOfLastName
                )}
            </button>


            {/* Dropdown Menu */}
            {open && (
                <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-xl p-3 z-[999]">
                    {/* Profile */}
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <div className="w-12 h-12 rounded-full text-xl font-semibold bg-black text-white flex items-center cursor-pointer overflow-hidden justify-center uppercase">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                firstLetterOfLastName
                            )}
                        </div>
                        <div>
                            <p className="font-semibold">{username ? capitalizeWords(username) : "Đang tải..."}</p>
                            <p className="text-sm text-gray-500">Xem tất cả trang cá nhân</p>
                        </div>
                    </div>

                    <div className="h-[1px] bg-gray-200 my-2"></div>

                    <MenuItem icon={<Settings size={20} />} label="Cài đặt & quyền riêng tư" />
                    <MenuItem icon={<HelpCircle size={20} />} label="Trợ giúp & hỗ trợ" />
                    <MenuItem icon={<Monitor size={20} />} label="Màn hình & trợ năng" />
                    <MenuItem icon={<MessageSquare size={20} />} label="Đóng góp ý kiến" />
                    <MenuItem icon={<LogOut size={20} />} label="Đăng xuất" />

                    <p className="text-xs text-gray-500 px-3 mt-2">
                        Quyền riêng tư · Điều khoản · Quảng cáo · Cookie · Xem thêm
                    </p>
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
                {icon}
                <span className="font-medium">{label}</span>
            </div>
            <ChevronRight size={20} />
        </div>
    );
}


/* --------------------- */
/* MENU CỤC BỘ */
/* --------------------- */

function MenuOverlay({ onClose }: { onClose: () => void }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const [openPostForm, setOpenPostForm] = useState(false);

    return (
        <div className="absolute top-14 right-0  h-[calc(100vh-56px)] bg-gray-100 z-[999] overflow-auto">

            <div ref={ref} className="max-w-[1180px] mx-auto p-4 flex gap-4">

                {/* LEFT SIDE */}
                <div className="w-[360px] bg-white rounded-xl shadow p-4">
                    <h2 className="text-2xl font-bold mb-4">Menu</h2>

                    {/* Search */}
                    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full mb-4">
                        <Search size={18} className="text-gray-500" />
                        <input
                            placeholder="Tìm kiếm trong menu"
                            className="ml-2 bg-transparent outline-none text-sm w-full"
                        />
                    </div>

                    {/* SOCIAL */}
                    <SectionMenu title="Xã hội">
                        <MenuItemMenu icon={<Calendar />} label="Sự kiện" desc="Tổ chức hoặc tìm sự kiện cùng những hoạt động xung quanh bạn." />
                        <MenuItemMenu icon={<Users />} label="Bạn bè" desc="Tìm kiếm bạn bè hoặc những người bạn có thể biết." />
                        <MenuItemMenu icon={<LayoutGrid />} label="Nhóm" desc="Kết nối với những người cùng chung sở thích." />
                        <MenuItemMenu icon={<Newspaper />} label="Bảng tin" desc="Xem bài viết phù hợp của những người và Trang bạn theo dõi." />
                        <MenuItemMenu icon={<Newspaper />} label="Bảng feed" desc="Xem bài viết gần đây từ bạn bè, nhóm và Trang." />
                    </SectionMenu>

                    {/* ENTERTAINMENT */}
                    <SectionMenu title="Giải trí">
                        <MenuItemMenu icon={<PlaySquare />} label="Video chơi game" desc="Xem, kết nối với người phát trực tiếp." />
                        <MenuItemMenu icon={<Gamepad />} label="Chơi game" desc="Chơi game bạn yêu thích." />
                        <MenuItemMenu icon={<PlaySquare />} label="Video" desc="Khám phá video theo sở thích của bạn." />
                    </SectionMenu>

                    {/* SHOPPING */}
                    <SectionMenu title="Mua sắm">
                        <MenuItemMenu icon={<Store />} label="Đơn đặt hàng và thanh toán" desc="Thanh toán nhanh chóng và an toàn." />
                    </SectionMenu>
                </div>

                {/* RIGHT SIDE */}
                <div className="w-[280px] bg-white rounded-xl shadow p-4 h-fit">
                    <h2 className="text-lg font-bold mb-3">Tạo</h2>

                    {/* <CreateItemMenu label="Đăng" icon="📝" /> */}
                    <CreateItemMenu
                        label="Đăng"
                        icon="📝"
                        onClick={() => setOpenPostForm(true)}
                    />

                    <CreateItemMenu label="Tin" icon="📷" />
                    <CreateItemMenu label="Thước phim" icon="🎬" />
                    <CreateItemMenu label="Sự kiện trong đời" icon="⭐" />

                    <div className="border-t my-3" />

                    <CreateItemMenu label="Trang" icon="📌" />
                    <CreateItemMenu label="Quảng cáo" icon="📣" />
                    <CreateItemMenu label="Nhóm" icon="👥" />
                    <CreateItemMenu label="Sự kiện" icon="📅" />
                    <CreateItemMenu label="Bài niêm yết Marketplace" icon="🛒" />
                </div>
                {openPostForm && <CreatePost onClose={() => setOpenPostForm(false)} />}

            </div>
        </div>
    );
}


function SectionMenu({ title, children }: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function MenuItemMenu({ icon, label, desc }: {
    icon: React.ReactNode;
    label: string;
    desc: string;
}) {
    return (
        <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div className="text-blue-600">{icon}</div>
            <div>
                <p className="font-medium">{label}</p>
                <p className="text-gray-500 text-sm">{desc}</p>
            </div>
        </div>
    );
}

function CreateItemMenu({ icon, label, onClick }: {
    icon: string | React.ReactNode;
    label: string;
    onClick?: () => void;
}) {
    return (
        <div onClick={onClick} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div className="text-xl">{icon}</div>
            <p className="font-medium">{label}</p>
        </div>
    );
}
