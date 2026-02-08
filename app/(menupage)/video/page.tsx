"use client";

import React, { useState, useEffect } from "react";
import Auth from "@/service/user";

export default function App() {

  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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
    const form = new FormData();
    form.append("content", content);
    if (file) form.append("file", file);

    const res = await fetch("http://localhost:8080/posts", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    alert(data.message);
    setContent("");
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-5 p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">Tạo bài viết</h2>

      {/* Content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Bạn đang nghĩ gì thế?"
        className="w-full h-32 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Preview */}
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

      {/* Upload Button */}
      <div className="mt-4 flex items-center justify-between border p-3 rounded-xl">
        <label className="cursor-pointer flex gap-2 items-center">
          <input type="file" className="hidden" onChange={handleFile} />
          📁 <span>Chọn file (ảnh / video / tài liệu)</span>
        </label>

        {file && (
          <span className="text-sm text-gray-500">{file.name}</span>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={submitPost}
        className="w-full mt-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Đăng bài
      </button>
    </div>
  );
}
