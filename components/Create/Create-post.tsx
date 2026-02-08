"use client";

import { useState, useEffect, SetStateAction } from "react";
import Post from "@/service/post";
import Auth from "@/service/user";
import { useAuthStore } from "@/service/service-once/AuthState";
import Loading from "@/components/loading/Loading";
import { useRef } from "react";


function capitalizeWords(str: string | undefined) {
    if (!str) return "";
    return str
        .split(" ")
        .filter(Boolean) // bỏ khoảng trắng thừa
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}
export default function CreatePost({ onClose }: { onClose: () => void }) {
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [showColors, setShowColors] = useState(false);
    const [backgroundColor, setSelectedColor] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    //const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [fileType, setFileType] = useState<"image" | "video" | null>(null);
    const [loading, setLoading] = useState(false);

    //const [usernames, setUsernames] = useState("")
    const COLORS = [
        "#f87171",
        "#fb923c",
        "#fbbf24",
        "#34d399",
        "#60a5fa",
        "#a78bfa",
        "#f472b6",
        "linear-gradient(45deg, #f87171, #60a5fa)",
        "linear-gradient(45deg, #34d399, #a78bfa)",
        "linear-gradient(45deg, #fbbf24, #f472b6)",
    ];
    const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const f = e.target.files?.[0] || null;
        if (!f) return;

        setFile(f);

        // Tạo preview cho ảnh/video
        // if (type === "imageVideo") {
        //     const url = URL.createObjectURL(f);
        //     setPreviewUrl(url);
        // }
        const url = URL.createObjectURL(f);
        setPreviewUrl(url);

        if (f.type.startsWith("image")) {
            setFileType("image");
        } else if (f.type.startsWith("video")) {
            setFileType("video");
        }
    };
    const user = useAuthStore((state) => state.user);

    const handleSubmit = async () => {
        if (loading) return;
        try {
            setLoading(true);
            const res = await Post.Thembaipost(content, file, backgroundColor);
            alert("Đăng bài thành công!");
            onClose();
        } catch (err: any) {
            alert(err?.error || "Lỗi khi đăng bài");
        } finally {
            setLoading(false); // tắt loading dù thành công hay lỗi
        }
    };

    const username = user?.username || "";
    const usernames = user?.username;
    const avatarUrl = user?.avaturl;

    const firstLetterOfLastName =
        username
            ?.trim()
            .split(" ")
            .pop()
            ?.charAt(0)
            ?.toUpperCase() || "";


    const [privacy, setPrivacy] = useState("public");

    const handleSelectPrivacy = (value: SetStateAction<string>) => {
        setPrivacy(value);
        setShowPrivacyModal(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]">
            {loading && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <Loading/>
                </div>
            )}

            <div className="bg-white w-[500px] rounded-xl  max-h-[90vh] flex flex-col">
                <div className="w-full border-b mt-1 p-3 h-15 flex items-center justify-between relative">
                    {/* Tiêu đề căn giữa tuyệt đối */}
                    <h2 className="text-2xl font-bold absolute left-1/2 -translate-x-1/2">
                        Tạo bài viết
                    </h2>

                    {/* Nút đóng (X) nằm bên phải */}
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 absolute rounded-full right-3 w-10 h-10 font-semibold bg-gray-400 text-white"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                    <div className="w-12 h-12 rounded-full overflow-hidden justify-center text-xl font-semibold bg-black text-white flex items-center justify-center uppercase">
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
                        <p className="font-semibold">{usernames}</p>
                        <p
                            onClick={() => setShowPrivacyModal(true)}
                            className="text-sm text-gray-500 cursor-pointer hover:underline"
                        >
                            Tình trạng
                        </p>
                    </div>
                </div>
                {showPrivacyModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                        <div className="bg-white w-[400px] rounded-xl shadow-lg p-4 animate-fadeIn">

                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-semibold">Đối tượng bài viết</h2>
                                <button
                                    onClick={() => setShowPrivacyModal(false)}
                                    className="text-gray-500 hover:text-black"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Ai có thể xem bài viết của bạn?
                            </p>
                            <div className="space-y-3">

                                {/* Công khai */}
                                <div
                                    onClick={() => handleSelectPrivacy("public")}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                                >
                                    <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                                        🌎
                                    </div>

                                    <div>
                                        <p className="font-medium">Công khai</p>
                                        <p className="text-sm text-gray-500">
                                            Bất kỳ ai ở trong hoặc ngoài Facebook
                                        </p>
                                    </div>
                                </div>

                                {/* Bạn bè */}
                                <div
                                    onClick={() => handleSelectPrivacy("friends")}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                                >
                                    <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                                        👥
                                    </div>

                                    <div>
                                        <p className="font-medium">Bạn bè</p>
                                        <p className="text-sm text-gray-500">
                                            Bạn bè của bạn trên Facebook
                                        </p>
                                    </div>
                                </div>

                                {/* Bạn bè ngoại trừ… */}
                                <div
                                    onClick={() => handleSelectPrivacy("exclude")}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                                >
                                    <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                                        🚫
                                    </div>

                                    <div>
                                        <p className="font-medium">Bạn bè ngoại trừ…</p>
                                        <p className="text-sm text-gray-500">
                                            Không hiển thị với một số bạn bè
                                        </p>
                                    </div>
                                </div>

                                {/* Bạn bè cụ thể */}
                                <div
                                    onClick={() => handleSelectPrivacy("specific")}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                                >
                                    <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                                        🎯
                                    </div>

                                    <div>
                                        <p className="font-medium">Bạn bè cụ thể</p>
                                        <p className="text-sm text-gray-500">
                                            Chỉ hiển thị với những người bạn chọn
                                        </p>
                                    </div>
                                </div>

                                {/* Chỉ mình tôi */}
                                <div
                                    onClick={() => handleSelectPrivacy("only_me")}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                                >
                                    <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                                        🔒
                                    </div>

                                    <div>
                                        <p className="font-medium">Chỉ mình tôi</p>
                                        <p className="text-sm text-gray-500">
                                            Chỉ bạn mới xem được bài viết
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* BUTTON TIẾP tục */}
                            <button
                                onClick={() => setShowPrivacyModal(false)}
                                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
                            >
                                Tiếp
                            </button>
                        </div>
                    </div>
                )}
                <div className="overflow-y-auto">
                    <div
                        className={`mb-3 p-5 ${backgroundColor ? "flex items-center justify-center" : ""
                            }`}
                        style={{
                            background: backgroundColor || "white",
                            color: backgroundColor ? "white" : "black",
                            height: backgroundColor ? "300px" : "auto",
                        }}
                    >
                        <textarea
                            value={content}
                            onChange={(e) => {
                                const text = e.target.value;
                                setContent(text);

                                // auto resize
                                e.target.style.height = "auto";
                                e.target.style.height = e.target.scrollHeight + "px";

                                // Nếu hơn 200 chữ → xoá backgroundColor
                                if (text.length > 200 && backgroundColor !== null) {
                                    setSelectedColor(null); // hoặc "" tùy bạn dùng
                                }
                            }}
                            placeholder={`${username} ơi, bạn đang nghĩ gì thế?`}
                            className={`
                            w-full
                            bg-transparent
                            outline-none
                            text-2xl
                            font-semibold
                            transition-all
                            resize-none
                            leading-snug
                            ${backgroundColor
                                    ? "text-white placeholder-white text-center"
                                    : "text-black placeholder-gray-500"}
                        `}
                            style={{
                                height: "auto",
                                overflowY: "auto",
                                maxWidth: backgroundColor ? "80%" : "100%",
                            }}
                            rows={1}
                        />

                    </div>

                    <div className="p-3">
                        {/* Button chọn màu nền giống FB */}
                        {!previewUrl && (<>
                            {!showColors && (
                                <div className="mb-3">
                                    <button
                                        onClick={() => setShowColors(true)}
                                        className="w-10 h-10 rounded-lg border flex items-center justify-center shadow-sm"
                                        style={{
                                            background: backgroundColor || "white",
                                        }}
                                    >
                                        <span className="text-lg font-bold text-gray-700">Aa</span>
                                    </button>
                                </div>
                            )}

                            {showColors && (
                                <div className="flex gap-2 flex-wrap mb-3">

                                    {/* Nút xoá màu */}
                                    <div
                                        onClick={() => {
                                            setSelectedColor(null);
                                            setShowColors(false);
                                        }}
                                        className="w-10 h-10 rounded-lg cursor-pointer border flex items-center justify-center text-red-500 font-bold"
                                    >
                                        ✖
                                    </div>

                                    {COLORS.map((color, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                setSelectedColor(color);
                                                setShowColors(false);
                                            }}
                                            className="w-10 h-10 rounded-lg cursor-pointer border"
                                            style={{ background: color }}
                                        />
                                    ))}
                                </div>
                            )}</>)}
                        {previewUrl && (
                            <div className="relative mt-3 rounded-xl overflow-hidden border">
                                {/* Nút X xoá preview */}
                                <button
                                    onClick={() => {
                                        setPreviewUrl(null);
                                        setFile(null);
                                        setFileType(null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = "";
                                        }
                                    }}

                                    className="absolute top-2 right-2 z-10 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                >
                                    ✕
                                </button>

                                {/* Ảnh */}
                                {fileType === "image" && (
                                    <img
                                        src={previewUrl}
                                        alt="preview"
                                        className="w-full max-h-[400px] object-contain bg-black"
                                    />
                                )}

                                {/* Video */}
                                {fileType === "video" && (
                                    <video
                                        src={previewUrl}
                                        controls
                                        className="w-full max-h-[400px] object-contain bg-black"
                                    />
                                )}
                            </div>
                        )}
                        {/* Upload file */}
                        <button
                            onClick={() => setShowPopup(true)}
                            className="flex items-center mt-4 gap-2 w-full p-2 hover:bg-gray-100 rounded-lg border"
                        >
                            Thêm vào bài viết của bạn
                        </button>


                    </div>
                </div>
                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[999999]">
                        <div className="bg-white rounded-xl p-4 w-[400px]">
                            <div className="w-full h-15 flex mb-3 items-center justify-between relative">
                                {/* Tiêu đề căn giữa tuyệt đối */}
                                <h2 className="text-xl w-full font-bold absolute left-1/2 -translate-x-1/3">
                                    Thêm vào bài viết của bạn
                                </h2>

                                {/* Nút đóng (X) nằm bên phải */}
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="p-2 hover:bg-gray-100 absolute rounded-full left-0 w-10 h-10 font-semibold bg-gray-400 text-white"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="flex flex-col gap-3">

                                <button
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                                    onClick={() => {
                                        setShowPopup(false);
                                        document.getElementById("inputImageVideo")?.click();
                                    }}
                                >
                                    📷 Ảnh/video
                                </button>

                                {/* File GIF → PDF, Word, Excel */}
                                <button
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                                    onClick={() => {
                                        setShowPopup(false);
                                        document.getElementById("inputDocument")?.click();
                                    }}
                                >
                                    🎞️ File GIF
                                </button>
                                {/* Gắn thẻ */}
                                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                                    🧑‍🤝‍🧑 Gắn thẻ người khác
                                </button>

                                {/* Cảm xúc */}
                                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                                    🙂 Cảm xúc/hoạt động
                                </button>

                                {/* Check in */}
                                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                                    📍 Check in
                                </button>

                                {/* GIF */}
                                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                                    🎞️ File GIF
                                </button>

                                {/* Live video */}
                                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                                    🔴 Video trực tiếp
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Input ẩn: Ảnh / Video */}
                <input
                    ref={fileInputRef}
                    id="inputImageVideo"
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => handleSelectFile(e, "imageVideo")}
                />

                {/* Input ẩn: File GIF (PDF, Word, Excel) */}
                <input
                    id="inputDocument"
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    className="hidden"
                    onChange={(e) => handleSelectFile(e, "document")}
                />

                <div className="flex justify-end gap-3 mb-2 p-3">
                    <button
                        disabled={!user}
                        onClick={handleSubmit}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Đăng
                    </button>
                </div>
            </div>
        </div>
    );
}
