"use client";

import React, { useState, useEffect } from "react";
import Auth from "@/service/user";
import { initSocket, getSocket } from '@/service/socket';
import Filend from '@/service/filend';
import './style.css';

interface StrangerUser {
    huyKetBan: any;
    id: number;
    pendingId: number;
    username: string;
    email: string;
    sdt: string;
    avatUrl: string;
    isSent?: boolean;
    friendRequestId?: number;
}

export default function App() {

    const [users, setUsers] = useState<StrangerUser[]>([]);
    const [count, setCount] = useState(0);

    const fetchStrangers = async () => {
        try {
            const rest = await Filend.getUserfilend();
            setUsers(rest?.data?.users || []);
            setCount(rest?.data.users.length);
        } catch (err: any) {
            setMessage(err.error || "Lỗi");
        }
    }

    useEffect(() => {
        fetchStrangers();
    }, []);

    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string | null>(null); // lưu số điện thoại
    const [message, setMessage] = useState("");

    const handleOpenForm = (sdt: string) => {
        setSelectedUser(sdt);
        setShowForm(true);
        setMessage("");
    };

    const handleSend = async () => {
        try {
            const result = await Filend.postFilend(selectedUser, message);
            alert("📩 Đã gửi lời mời kết bạn!");
            // 1. Đóng form
            setShowForm(false);
            setMessage("");
            const requestId = result.friendRequestId;
            setUsers(prev =>
                prev.map(u =>
                    u.sdt === selectedUser
                        ? {
                            ...u,
                            isSent: true,
                            friendRequestId: requestId, // <-- SET Ở ĐÂY
                        }
                        : u
                )
            );
            setMessage("");
        } catch (err: any) {
            alert(err.message || "Lỗi khi gửi lời mời kết bạn");
        }

        setShowForm(false);
        setMessage("");
    };

    const [ishuyketban, setIshuyketban] = useState(false);

    const handleHuy = async (id?: number) => {
        try {
            const data = await Filend.putDeleteFilendReject(id);
            setUsers(prev =>
                prev.map(u =>
                    u.friendRequestId === id
                        ? { ...u, isSent: false, friendRequestId: undefined, huyKetBan: true }
                        : u
                )
            );
            setIshuyketban(true);
            if (data) {
                alert("Đã huỷ kết bạn thành công");
            }
        } catch (error: any) {
            return;
        }
    };

    return (
        <div className="">
            <div className="flex-none w-full trangtru_khungketban">
                <h2 className="text-2xl font-bold">Những người bạn có thể biết</h2>
                {/* ({count}) */}
                <ul className="mt-4 mr-2 khungketban_ul">
                    {users.map(u => {
                        const firstLetterOfLastName =
                            u.username
                                ?.trim()
                                .split(" ")
                                .pop()
                                ?.charAt(0)
                                ?.toUpperCase() || "";
                        return (
                            <li
                                key={u?.id ?? Math.random()}
                                className="khungketban_li bg-white rounded-xl shadow border overflow-hidden"
                            >
                                {/* Ảnh */}
                                <div className="w-full khungketban_li_img h-48 overflow-hidden">
                                    {/* <img
                                        src={u.avatUrl}
                                        alt=""
                                        className="w-full h-full object-cover "
                                    /> */}
                                    {u.avatUrl ? (
                                        <img
                                            src={u.avatUrl}
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full text-3xl font-semibold bg-black text-white flex items-center justify-center uppercase">{firstLetterOfLastName}</div>
                                    )}
                                </div>

                                {/* Nội dung */}
                                <div className="p-3 khungketban_li_name">
                                    <p className="font-bold text-[18px] text-gray-900 username">
                                        {u.username}
                                    </p>

                                    <div className="mt-3 khungketban_li_name_div">

                                        
                                        {u.isSent ? (
                                            <>
                                                <p className="text-[13px] text-gray-600 mb-2">Đã gửi lời mời</p>

                                                <button
                                                    className="w-full py-2 rounded-lg bg-gray-300 text-gray-700 font-medium cursor-pointer hover:bg-gray-400 transition"
                                                    onClick={() => handleHuy(u.friendRequestId)}
                                                >
                                                    Huỷ
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {u.huyKetBan && (
                                                    <p className="text-[14px] font-bold text-red-600 mb-2">
                                                        Bạn đã huỷ kết bạn
                                                    </p>
                                                )}

                                                <button
                                                    onClick={() => handleOpenForm(u.sdt)}
                                                    className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                                                >
                                                    Thêm bạn bè
                                                </button>
                                            </>
                                        )}

                                        {/* Nút gỡ */}

                                    </div>
                                </div>
                            </li>

                        )
                    }
                    )}
                </ul>

                {/* <ul className="flex">
                    {users.map(u => (
                        <li key={u?.id ?? Math.random()} className="w-[20%] m-1 border">
                            <img src={u.avatUrl} alt="" className="w-full h-full object-cover" />
                            {u.username}
                            <div>
                                <div>
                                    {u.isSent ? (
                                        <>
                                            <p>
                                                Đã gửi lời mời
                                            </p>
                                            <button
                                                className="py-2 px-3 bg-gray-400 rounded text-white text-sm font-bold cursor-default"
                                                onClick={() => handleHuy(u.friendRequestId)}
                                            >
                                                Huỷ
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {u.huyKetBan && <p>Bạn đã huỷ kết bạn</p>}
                                            <button
                                                onClick={() => handleOpenForm(u.sdt)}
                                                className="py-2 px-3 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-bold"
                                            >
                                                Kết bạn
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul> */}
                {showForm && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-5 rounded-xl from_guiloimoi_ketban shadow-lg">
                            <h3 className="text-xl text-center font-bold mb-3">
                                Nội dung gửi kết bạn
                            </h3>

                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full border rounded p-2
                            bg-transparent
                            outline-none
                            h-35
                            text-lg
                            font-semibold
                            transition-all
                            resize-none
                            leading-snug"
                                placeholder="Nhập nội dung..."
                            />

                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Hủy
                                </button>

                                <button
                                    onClick={handleSend}
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Gửi
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
