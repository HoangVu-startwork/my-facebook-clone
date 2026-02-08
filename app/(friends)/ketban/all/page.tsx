"use client";

import { useState } from "react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function BulkRegisterAdvanced() {
  const [apiUrl, setApiUrl] = useState(
    "http://localhost:9001/api/users/register"
  );
  const [count, setCount] = useState(100);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    success: 0,
    fail: 0,
    time: 0,
  });

  const [log, setLog] = useState<string[]>([]);

  // FORM NHẬP TỪ INPUT
  const [form, setForm] = useState({
    username: "",
    email: "",
    sdt: "",
    password: "",
    ngaysinh: "",
    giotinh: "",
    avatUrl: "",
  });

  const increasePhone = (phone: string, index: number) =>
    (BigInt(phone) + BigInt(index)).toString();

  const increaseEmail = (email: string, index: number) => {
    const [name, domain] = email.split("@");
    const match = name.match(/(\d+)$/);
    if (!match) return email;
    const num = parseInt(match[1], 10) + index;
    return `${name.replace(/\d+$/, num.toString())}@${domain}`;
  };
  const validateForm = () =>
    form.username &&
    form.email &&
    form.sdt &&
    form.password &&
    form.giotinh &&
    form.ngaysinh;

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    setLoading(true);
    setLog([]);
    setStats({ success: 0, fail: 0, time: 0 });

    const startTime = performance.now();

    let success = 0;
    let fail = 0;

    const users = Array.from({ length: count }).map((_, i) => ({
      ...form,
      sdt: increasePhone(form.sdt, i),
      email: increaseEmail(form.email, i),
    }));

    // 🧠 THROTTLE: 10 REQUEST / 100ms
    for (let i = 0; i < users.length; i += 10) {
      const batch = users.slice(i, i + 10);

      const results = await Promise.all(
        batch.map(async (payload) => {
          try {
            const res = await fetch(apiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            let data: any = {};
            try {
              data = await res.json(); // đọc message backend
            } catch {}

            if (!res.ok) {
              throw new Error(
                `${res.status} | ${data.message || "Unknown error"}`
              );
            }

            success++;
            return `✅ ${payload.email}`;
          } catch (err: any) {
            fail++;
            return `❌ ${payload.email} | ${err.message}`;
          }
        })
      );

      setLog((prev) => [...prev, ...results]);
      setStats((s) => ({ ...s, success, fail }));

      await sleep(100);
    }

    const endTime = performance.now();

    setStats((s) => ({
      ...s,
      time: Math.round(endTime - startTime),
    }));

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-3 border rounded">
      <h2 className="text-xl font-bold">🚀 Bulk Register Users</h2>

      <input
        className="w-full border p-2"
        value={apiUrl}
        onChange={(e) => setApiUrl(e.target.value)}
        placeholder="API URL"
      />

      {Object.keys(form).map((key) => (
        <input
          key={key}
          className="w-full border p-2"
          placeholder={key}
          value={(form as any)[key]}
          onChange={(e) =>
            setForm({
              ...form,
              [key]: e.target.value,
            })
          }
        />
      ))}

      <input
        type="number"
        className="w-full border p-2"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        placeholder="Số request"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white p-2"
      >
        {loading ? "Đang gửi..." : `Gửi ${count} request`}
      </button>

      {/* 📊 THỐNG KÊ */}
      <div className="grid grid-cols-3 gap-2 text-sm text-center">
        <div>✅ Success: {stats.success}</div>
        <div>❌ Fail: {stats.fail}</div>
        <div>⏱️ Time: {stats.time} ms</div>
      </div>

      {/* 📜 LOG */}
      <div className="max-h-56 overflow-auto border p-2 text-sm">
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}
