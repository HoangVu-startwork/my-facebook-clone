"use client";
import React, { useState, useEffect, useRef } from "react";
import Filend from '@/service/filend';
import './style.css'
import User from '@/service/user';
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, MapPinHouse, MapPinned } from "lucide-react";
import image_vavart_null from "@/public/image/avatuser_null.png";
import Loading from "@/components/loading/Loading";
import {
    ArrowLeft
} from "lucide-react";
interface StrangerUser {
    huyKetBan: any;
    id: number;
    pendingId: number;
    username: string;
    email: string;
    sdt: string;
    senderId: number;
    // status: string;
    status: "pending" | "accepted";
    avatUrl: string;
    isSent?: boolean;
    friendRequestId?: number;
}

interface IntroduceEducation {

}
export default function page() {

    const [data, setData] = useState<StrangerUser[]>([]);
    const [count, setCount] = useState(0);

    const fetchStrangers = async () => {
        try {
            const rest = await Filend.getReceivePending();
            const list = rest.data.data || [];
            const total = list.length;
            setCount(total);
            setData(rest.data.data)
        } catch (err: any) {
            console.log(err.error || "Lỗi khi đăng bài");
        }
    };

    useEffect(() => {
        fetchStrangers()
    }, [])
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [introduce, setIntroduce] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [datastatus, setDatastatus] = useState("");
    const fetchIntroduceEducation = async (userId: number) => {
        setBaivietData("");
        setDatastatus("");
        try {
            setLoading(true);
            const IntroduceEducation = await User.getIntroduce(userId);
            console.log(IntroduceEducation.data.data);
            setBaivietData(IntroduceEducation.data.data);
            setDatastatus(IntroduceEducation.data.data.sentRequests.status)
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }

    const fetchchapnhanketban = async (pendingId: number) => {
        if (loading) return;
        try {
            setLoading(true);
            const data = await Filend.putFilendAccept(pendingId);
            setData(prev =>
                prev.map(u =>
                    u.pendingId === pendingId
                        ? {
                            ...u,
                            status: "accepted"
                        }
                        : u
                )
            );
            setDatastatus("accepted");
        } catch (err) {

        } finally {
            setLoading(false); // tắt loading dù thành công hay lỗi
        }
    }


    type TabType = "baiviet" | "gioithieu" | "banbe" | "anh";
    const [activeTab, setActiveTab] = useState<TabType>("baiviet");
    const [loadingtap, setLoadingtap] = useState(false);

    // data
    const [baivietData, setBaivietData] = useState<any>(null);
    const [gioithieuData, setGioithieuData] = useState<any>(null);

    const fetchIntroduceBaiviet = async (userId: number) => {
        console.log(userId);
        try {
            // setLoading(true);
            // const res = await User.getIntroducebaiviet(userId);
            // setBaivietData(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchIntroduceGioithieu = async (userId: number) => {
        console.log(userId);
        try {
            // setLoading(true);
            // const res = await User.getIntroducegioithieu(userId);
            // setGioithieuData(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!selectedUserId) return;

        if (activeTab === "baiviet" && !baivietData) {
            fetchIntroduceBaiviet(selectedUserId);
        }

        if (activeTab === "gioithieu" && !gioithieuData) {
            fetchIntroduceGioithieu(selectedUserId);
        }
    }, [activeTab, selectedUserId]);

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click ngoài để đóng
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <div className="w-full">
            {loading && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <Loading/>
                </div>
            )}
            <div className="flex h-full pr-2 requests-page-ketban">
                <div className="requests-guiketban pl-1 pr-1">
                    <div>
                        <div className="requests-trangfriends mt-2">
                            <div className="requests-trangfriends-link"><Link href="/ketban/friends"><ArrowLeft /></Link></div>
                            <div className="requests-trangfriends-div">
                                <p className="requests-trangfriends-div-p text-xs">Bạn bè</p>
                                <h3 className="requests-trangfriends-div-h3 text-base font-medium">Lời mòi kết bạn</h3>
                            </div>
                        </div>
                        <p className="text-sm font-semibold pl-2 mt-2">{count} Lời mời kết bạn</p>
                    </div>
                    {data.map(u => {
                        const firstLetterOfLastName =
                            u.username
                                ?.trim()
                                .split(" ")
                                .pop()
                                ?.charAt(0)
                                ?.toUpperCase() || "";
                        return (
                            <div key={u?.id ?? Math.random()}>
                                <div className="loimoiketban p-2 mt-2 pr-3 bg-gray-200 cursor-pointer hover:bg-gray-300" onClick={() => {
                                    setSelectedUserId(u.senderId);
                                    setDatastatus(u.status);
                                    fetchIntroduceEducation(u.senderId);
                                }}>
                                    <div className="loimoiketban-left">
                                        <div className="w-17 h-17 rounded-full overflow-hidden text-xl font-semibold bg-black text-white flex items-center justify-center uppercase">
                                            {u.avatUrl ? (
                                                <img
                                                    src={u.avatUrl}
                                                    alt="avatar"
                                                    className="w-full h-full object-cover object-top"
                                                />
                                            ) : (
                                                <div className="h-full text-3xl font-semibold bg-black text-white flex items-center justify-center uppercase">{firstLetterOfLastName}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="loimoiketban-right">
                                        <p className="text-lg font-semibold">{u.username}</p>
                                        <div className="nuttrangthai_loimoiketban mt-1">
                                            {u.status === "pending" ? (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            fetchchapnhanketban(u.pendingId)}}
                                                        className="w-full text-xs py-2 rounded-lg bg-blue-600 text-white font-normal hover:bg-blue-700 transition"
                                                    >
                                                        Xác nhận
                                                    </button>
                                                    <button
                                                        // onClick={() => handleOpenForm(u.sdt)}
                                                        className="w-full text-xs py-2 rounded-lg bg-gray-500 text-white font-normal hover:bg-blue-700 transition"
                                                    >
                                                        Xoá
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <p>Đã chấp nhận lời mời kết bạn</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="requests-thongtin overflow-auto">
                    {!baivietData ? (<></>
                    ) : (
                        <>
                            <div className="fb-profile-header">
                                {/* Cover */}
                                <div className="fb-profile-header-div">
                                    <div className="fb-cover"></div>
                                    <div className="fb-info-wrapper">
                                        <div className="fb-avatar rounded-full overflow-hidden text-xl font-semibold bg-black text-white flex items-center justify-center uppercase">
                                            {baivietData.avatUrl ? (
                                                <img
                                                    src={baivietData.avatUrl}
                                                    alt="avatar"
                                                    className="w-full h-full object-cover object-top"
                                                />
                                            ) : (
                                                <img
                                                    src={image_vavart_null.src}
                                                    alt="avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            )}

                                        </div>

                                        <div className="fb-name-actions">
                                            <h1 className="fb-name">{baivietData.username}</h1>
                                            {datastatus === "accepted" ? (
                                                <button className="btn bg-green-600 text-white">
                                                    ✅ Đã kết bạn
                                                </button>
                                            ) : (
                                                <div className="relative inline-block" ref={dropdownRef}>
                                                    <button
                                                        className="btn primary"
                                                        onClick={() => setOpen(!open)}
                                                    >
                                                        Phản hồi
                                                    </button>
                                                    {open && (
                                                        <div className="dropdown">
                                                            <div
                                                                className="dropdown-item"
                                                                onClick={() => {
                                                                    console.log("Xác nhận");
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                Xác nhận
                                                            </div>
                                                            <div
                                                                className="dropdown-item danger"
                                                                onClick={() => {
                                                                    console.log("Xóa lời mời");
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                Xóa lời mời
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                    <div className="flex bg-white mt-5">
                                        <TabItem label="Bài viết" active={activeTab === "baiviet"} onClick={() => setActiveTab("baiviet")} />
                                        <TabItem label="Giới thiệu" active={activeTab === "gioithieu"} onClick={() => setActiveTab("gioithieu")} />
                                        <TabItem label="Bạn bè" active={activeTab === "banbe"} onClick={() => setActiveTab("banbe")} />
                                        <TabItem label="Ảnh" active={activeTab === "anh"} onClick={() => setActiveTab("anh")} />
                                    </div>
                                </div>

                            </div>
                            <div className="fb-profile-header2 mt-0">
                                <div className="fb-profile-header-div2">
                                    {activeTab === "baiviet" && (
                                        <BaivietTab data={baivietData} loading={loading} />
                                    )}
                                    {/* {activeTab === "gioithieu" && (
                            <GioithieuTab data={gioithieuData} loading={loading} />
                        )} */}
                                    {activeTab === "banbe" && <div>Danh sách bạn bè</div>}

                                    {activeTab === "anh" && <div>Thư viện ảnh</div>}

                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>

        </div>
    )
}

const TabItem = ({ label, active, onClick }: any) => (
    <div
        onClick={onClick}
        className={`px-4 py-3 cursor-pointer font-semibold
        ${active ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}
        `}
    >
        {label}
    </div>
);

const renderSchoolName = (text: string) => {
    const prefixes = ["Đã học ", "Đang học tại ", "Đang học "];

    let prefixFound = "";
    let school = text;

    for (const prefix of prefixes) {
        if (text.startsWith(prefix)) {
            prefixFound = prefix;
            school = text.replace(prefix, "");
            break;
        }
    }

    return (
        <p className="font-tabtruong">
            {prefixFound}
            <span className="font-text-tabtruong text-gray-900">
                {school}
            </span>
        </p>
    );
};


const BaivietTab = ({ data, loading }: any) => {
    if (loading) return <p>Đang tải bài viết...</p>;
    //if (!data?.Posts?.length) return <p>Chưa có bài viết</p>;

    return (
        <div className="requests-tab-baiviet">
            <div className="requests-tab-baiviet-div-1">
                <div className="requests-tab-baiviet-div-1-1">
                    <h2>Giới thiệu</h2>
                    <div className="">
                        {/* {data.educations.map((post: any) => {
                            return (
                                <>
                                    {!selectedUserId && (
                                        <p className="text-gray-400">Chọn một người để xem thông tin</p>
                                    )}
                                </>
                            )
                        })} */}
                        {data?.educations?.length > 0 && (
                            data.educations.map((edu: any, index: number) => {
                                return (
                                    <div key={index} className="mb-1">
                                        <div className="tab-thongtintruonghoc">
                                            <div className="tab-thongtintruonghoc-1">
                                                <GraduationCap className="accommodation-mappinHouse" />
                                            </div>
                                            <div className="tab-thongtintruonghoc-2">
                                                {renderSchoolName(edu.schoolName)}
                                                <p className="tab-thongtintruonghoc-2-p text-gray-500">
                                                    {edu.level} • {edu.startYear} - {edu.endYear}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        {data?.information?.introduce && (
                            <div className="accommodation-diachi">
                                <div className="accommodation-diachi-icon">
                                    <MapPinned className="accommodation-mappinHouse" />
                                </div>
                                <p className="from-accommodation">Sống tại <strong>{data?.information?.introduce}</strong></p>
                            </div>
                        )}
                        {data?.information?.accommodation && (
                            <div className="accommodation-diachi mt-2">
                                <div className="accommodation-diachi-icon">
                                    <MapPinHouse className="accommodation-mappinHouse" />
                                </div>
                                <p className="from-accommodation">Đến từ <strong>{data?.information?.accommodation}</strong></p>
                            </div>
                        )}
                    </div>

                </div>
                <div className="requests-tab-baiviet-div-1-2 mt-3">
                    <h2>Ảnh</h2>
                    {data?.Posts?.length > 0 && (
                        <div className="grid grid-cols-3 gap-1">
                            {data.Posts.map((post: any, index: number) => (
                                <div
                                    key={index}
                                    className="aspect-square overflow-hidden rounded-md"
                                >
                                    {post.mediaType === "image" && (
                                        <img
                                            src={post.mediaUrl}
                                            alt="media"
                                            className="w-full h-full object-cover"
                                        />
                                    )}

                                    {post.mediaType === "video" && (
                                        <video
                                            src={post.mediaUrl}
                                            className="w-full h-full object-cover"
                                            muted
                                            playsInline
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="requests-tap-baiviet-div-2">
                <h2>Bài viết</h2>
            </div>
        </div>
    );
};

const GioithieuTab = ({ data, loading }: any) => {
    if (loading) return <p>Đang tải giới thiệu...</p>;
    if (!data) return <p>Không có dữ liệu</p>;

    return (
        <div className="space-y-2">
            <p><b>Email:</b> {data.email}</p>
            <p><b>SĐT:</b> {data.sdt}</p>
            <p><b>Giới tính:</b> {data.giotinh}</p>
            <p><b>Ngày sinh:</b> {data.ngaysinh}</p>
        </div>
    );
};
