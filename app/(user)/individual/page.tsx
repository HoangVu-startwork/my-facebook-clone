"use client";

import React, { useState, useRef } from "react";
import Auth from "@/service/user";
import './style.css'
import { useAuthStore } from "@/service/service-once/AuthState"
import { Camera } from 'lucide-react'; // Sử dụng thư viện icon lucide-react


export default function App() {

    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const logout = useAuthStore((state) => state.logout);

    // if (loading) return null;

    const username = user?.username || "";
    const id = user?.id || "";
    const avatarUrl = user?.avaturl;
    const avatUrlfacebooks = user?.avatUrlfacebook;
    const firstLetterOfLastName =
        username
            ?.trim()
            .split(" ")
            .pop()
            ?.charAt(0)
            ?.toUpperCase() || "";

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            console.log("Đang tải lên: " + file.name);
            const result = await Auth.putuploadavatUrlfacebook(file);
            alert("Cập nhật thành công!");
            // Cập nhật lại UI với link ảnh mới (result.avatUrlfacebooks)
            console.log("Link ảnh mới:", result.avatUrlfacebooks);
        } catch (error) {
            console.error("Lỗi:", error);
            console.log("lỖI ", error);
        }
    }

    return (
        <div>
            <div className="mt-15"></div>
            <div className="requests-thongtin-user overflow-auto">
                <div className="requests-thongtin-header-div">
                    <div className="requests-thongtin-anhnen">
                        <div className="relative w-full overflow-hidden rounded-b-xl group">
                            <div className="w-full h-full requests-thongtin-anhnen flex items-center bg-neutral-200 justify-center text-gray-900">
                                {avatUrlfacebooks ? (
                                    <img
                                        src={avatUrlfacebooks}
                                        alt="avatar"
                                        /* Thêm w-full để ảnh luôn tràn lề ngang */
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400">Chưa có ảnh bìa</span>
                                )}
                            </div>
                            <input
                                type="file"
                                id="cover-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                            <label htmlFor="cover-upload"
                                className="absolute bottom-4 right-4 flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-medium py-2 px-4 rounded-lg shadow-md transition-all active:scale-95"
                            >
                                <Camera size={18} />
                                <span className="text-sm">Thêm ảnh bìa</span>
                            </label>
                        </div>
                    </div>
                </div>
                {id}
            </div>
        </div>
    )
}
