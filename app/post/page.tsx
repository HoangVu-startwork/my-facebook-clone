"use client";

import React, { useState } from "react";
import Auth from "@/service/user";
import { initSocket } from "@/service/socket";

export default function App() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  //

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);

      // preview chỉ cho ảnh hoặc video
      if (selected.type.startsWith("image") || selected.type.startsWith("video")) {
        setPreview(URL.createObjectURL(selected));
      } else {
        setPreview(null);
      }
    }
  };

  const submitPost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn chưa đăng nhập!");
        return;
      }

      const form = new FormData();
      form.append("content", content);
      if (file) form.append("file", file);

      const res = await fetch("http://localhost:9000/api/postsfb", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,  // ⭐ Quan trọng
        },
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Đăng bài thành công!");
        setContent("");
        setFile(null);
        setPreview(null);
      } else {
        console.log(data)
        alert(data.message || "Đăng bài thất bại");
      }

    } catch (err) {
      console.error("Lỗi đăng bài:", err);
      alert("Có lỗi xảy ra khi đăng bài");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-5 p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">Tạo bài viết</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Bạn đang nghĩ gì thế?"
        className="w-full h-32 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {preview && (
        <div className="mt-3">
          {file?.type.startsWith("image") && (
            <img src={preview} className="w-full rounded-xl" />
          )}

          {file?.type.startsWith("video") && (
            <video src={preview} controls className="w-full rounded-xl" />
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border p-3 rounded-xl">
        <label className="cursor-pointer flex gap-2 items-center">
          <input type="file" className="hidden" onChange={handleFile} />
          📁 <span>Chọn file (ảnh / video / tài liệu)</span>
        </label>

        {file && <span className="text-sm text-gray-500">{file.name}</span>}
      </div>

      <button
        onClick={submitPost}
        className="w-full mt-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Đăng bài
      </button>
    </div>
  );
}
