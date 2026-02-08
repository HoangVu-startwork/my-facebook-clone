"use client";

import React, { useState, useEffect } from "react";
import Filend from '@/service/filend';
import Image from "next/image";
interface User {
    id: number;
    username: string;
    email: string;
    sdt: string;
    avatUrl: string;
    ngaysinh: string;
}

interface MonthGroup {
    month: number;
    count: number;
    users: User[];
}
export default function App() {

    const [data, setData] = useState<{ [key: number]: MonthGroup }>({});
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");

    const getUserAccepted = async () => {
        try {
            const data = await Filend.getUserAccepted();
            console.log(data.data.data)
            setData(data.data.data)
        } catch (err) {

        }
    }

    useEffect(() => {
        getUserAccepted()
    }, [])
    return (
        <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Sinh nhật bạn bè theo tháng</h2>
            <div className="max-w-3xl mx-auto mt-6 space-y-6">
                {Object.keys(data).map((monthStr) => {
                    const month = Number(monthStr); // ép kiểu string → number
                    const group = data[month];
                    const users = group?.users || [];

                    // if (users.length === 0) return null;

                    const first = users[0]?.username;
                    const second = users[1]?.username;
                    const more = users.length - 2;


                    return (
                        <div key={month} className="bg-white rounded-xl shadow p-4">
                            <h3 className="text-lg font-semibold">Tháng {month}</h3>

                            <p className="text-gray-600 mt-1">
                                <span className="font-bold">{first}</span>
                                {users.length >= 2 && (<>, <span className="font-bold">{second}</span></>)}
                                {users.length > 2 && ` và ${more} người khác`}
                            </p>

                            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2">
                                {users.slice(0, 6).map((u: User) => {
                                    const firstLetterOfLastName =
                                        u.username
                                            ?.trim()
                                            .split(" ")
                                            .pop()
                                            ?.charAt(0)
                                            ?.toUpperCase() || "";
                                    return (
                                        <div key={u.id} className="w-14 h-14 rounded-full text-xl font-semibold bg-black text-white flex items-center justify-center uppercase">
                                            {u.avatUrl ? (
                                                <img
                                                    src={u.avatUrl}
                                                    alt="avatar"
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                firstLetterOfLastName
                                            )}
                                        </div>
                                    )
                                })}
                                {users.length > 6 && (
                                    <div className="w-12 h-12 rounded-full text-sm font-semibold bg-gray-300 text-gray-700 flex items-center justify-center">
                                        +{users.length - 6}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}