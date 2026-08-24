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