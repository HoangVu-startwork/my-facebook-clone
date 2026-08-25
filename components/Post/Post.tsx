"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/service/service-once/AuthState";
import { useSocketStore } from "@/service/sockets/userSocketStore";
import Posts from "@/service/post";
import LinkeButton from "@/components/LikeButton/Likebutton";
import image_vavart_null from "@/public/image/avatuser_null.png";

import {
    MoreHorizontal,
    ThumbsUp,
    MessageCircle,
    Share2,
    Globe
} from "lucide-react";
import { on } from "events";


interface FriendRequestData {
    fromUserId: string;
    fromPhone: string;
    message: string;
}

export interface Reaction {
    code: string;
    icon: string;
    label: string;
    color?: string;
}

export interface ReactionDetail {
    code: string;
    count: number;
    label?: string;
    icon?: string;
}

export interface PostReactions {
    total: number;
    detail: ReactionDetail[]; // ✅ PHẢI LÀ ARRAY
}

export interface User {
    id: number;
    username?: string;
    avatUrl?: string | null;
}

export interface Postuser {
    id: number;
    content: string;
    createdAt: string;
    views: number;
    backgroundColor: string | null;
    fileType: string | null;
    fileUrl: string | null;
    mediaType: string | null;
    mediaUrl: string | null;
    fileName: string;
    myReaction?: Reaction | null;
    reactions: PostReactions; // ✅ GIỜ TS BIẾT reactions
    User?: User;
}

export interface ReactionResult {
    status: "added" | "removed" | "updated";
    reaction?: string;
}


export default function Post() {
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
    };

    const user = useAuthStore((state) => state.user);
    const socket = useSocketStore((s) => s.socket);
    //const [user, setUser] = useState<any>(null); // user hiện tại
    //const [socket, setSocket] = useState<any>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [msg, setMsg] = useState("");

    const [mes, setMes] = useState("");

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const infiniteObserverRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const [seed] = useState(() => Date.now().toString());
    const [dataPost, setDataPost] = useState<Postuser[]>([]);
    const fetchPost = async (pageNumber = 1) => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await Posts.getPost(pageNumber, 10, seed);
            setLoading(false);
            const newPosts = (response?.data?.data?.posts || []) as Postuser[];
            const pagination = response?.data?.data?.pagination;
            setDataPost(prev => [...prev, ...newPosts]);
            setHasMore(pagination?.hasMore ?? false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchPost(1);
    }, []);

    useEffect(() => {
        if (!hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage(prev => prev + 1);
                }
            },
            {
                root: null,
                rootMargin: "200px", // 👈 QUAN TRỌNG
                threshold: 0
            }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading]);



    useEffect(() => {
        if (page > 1) {
            fetchPost(page);
        }
    }, [page]);
    return (
        <>
        </>
    );
}