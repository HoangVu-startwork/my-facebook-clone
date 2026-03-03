"use client";

import React, { useState, useRef, useEffect } from "react";
import Auth from "@/service/user";
import { initSocket } from "@/service/socket";
import { useAuthStore } from "@/service/service-once/AuthState";
import { useSocketStore } from "@/service/sockets/userSocketStore";
import Posts from "@/service/post";
import LinkeButton from "@/components/LikeButton/Likebutton";
import image_vavart_null from "@/public/image/avatuser_null.png";
import { FileText } from "lucide-react";
import PostContent from "@/components/LikeButton/Post-content"
import { useReactionStore } from "@/service/service-once/PostState";
import { usePostView } from "@/service/service-once/usePostView";
import Conversation from "@/components/Message/Conversation";

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


export default function App() {

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
  // 🔹 Lấy token & user info


  // const fetchPost = async (pageNumber = 1) => {
  //   if (loading || !hasMore) return;

  //   setLoading(true);
  //   try {
  //     const response = await Posts.getPost(pageNumber, 20);
  //     const newPosts = response?.data?.data?.posts || [];
  //     const pagination = response?.data?.data?.pagination;

  //     setDataPost(prev => [...prev, ...newPosts]);
  //     setHasMore(pagination?.hasMore ?? false);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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


  // 314912,5
  // const fetchToken = async () => {
  //   try {
  //     const response = await Auth.gettoken();  // AxiosResponse
  //     setUser(response.data.user);              // lấy từ response.data
  //   } catch (error) {
  //     // localStorage.removeItem("token");
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchToken();
  // }, []);

  // 🔹 Khởi tạo socket khi user đã có id
  const fetchPosts = async () => {
    try {
      const response = await Posts.getPost();
      console.log(response?.data.data.posts);
      setDataPost(response?.data.data.posts)
    } catch (error) {

    }
  }

  useEffect(() => {
    if (!socket) return;

    const onNewRequest = (data: FriendRequestData) => {
      alert(`Lời mời từ ${data.fromPhone}`);
      setMes(`📩 Bạn có lời mời kết bạn từ số ${data.fromPhone}`)
    }

    socket.on("newFriendRequest", onNewRequest);

    return () => {
      socket.off("newFriendRequest", onNewRequest);
    };
  }, [socket]);


  type PostType = 'TEXT' | 'BACKGROUND' | 'FILE' | 'MEDIA';

  const getPostType = (post: Postuser): PostType => {
    if (post.backgroundColor && !post.fileType && !post.mediaType) {
      return 'BACKGROUND';
    }

    if (post.fileType && !post.backgroundColor && !post.mediaType) {
      return 'FILE';
    }

    if (post.mediaType && !post.backgroundColor && !post.fileType) {
      return 'MEDIA';
    }

    return 'TEXT';
  };

  const getFileType = (url: string) => {
    const ext = url.split(".").pop()?.toLowerCase();

    if (ext === "pdf") return "pdf";
    if (["doc", "docx"].includes(ext!)) return "word";
    if (["xls", "xlsx"].includes(ext!)) return "excel";

    return "file";
  };

  const FILE_CONFIG = {
    pdf: {
      label: "PDF",
      color: "text-red-500",
      bg: "bg-red-50",
    },
    word: {
      label: "WORD",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    excel: {
      label: "EXCEL",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    file: {
      label: "FILE",
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
  };

  const getFileNameFromUrl = (url?: string) => {
    if (!url) return "";

    try {
      const cleanUrl = url.split("?")[0]; // bỏ query
      const fileName = cleanUrl.split("/").pop();
      return fileName ? decodeURIComponent(fileName) : "";
    } catch {
      return "";
    }
  };

  const handleReact = (postId: number, result: ReactionResult) => {
    setDataPost(prev =>
      prev.map(post => {
        if (post.id !== postId) return post;

        const oldCode = post.myReaction?.code;
        const newCode = result.reaction;

        const detail = post.reactions.detail.map(d => ({ ...d }));
        const find = (code?: string) => detail.find(d => d.code === code);

        let total = post.reactions.total;
        let myReaction = post.myReaction;

        // ADD
        if (result.status === "added" && newCode && !oldCode) {
          total++;
          const d = find(newCode);
          d ? d.count++ : detail.push({ code: newCode, count: 1 });
          myReaction = { code: newCode } as any;
        }

        // REMOVE
        if (result.status === "removed" && oldCode) {
          total--;
          const d = find(oldCode);
          if (d) d.count--;
          myReaction = null;
        }

        // UPDATE
        if (result.status === "updated" && oldCode && newCode) {
          const oldD = find(oldCode);
          const newD = find(newCode);
          if (oldD) oldD.count--;
          newD ? newD.count++ : detail.push({ code: newCode, count: 1 });
          myReaction = { code: newCode } as any;
        }

        return {
          ...post,
          myReaction,
          reactions: {
            total,
            detail: detail.filter(d => d.count > 0),
          },
        };
      })
    );
  };


  const reactions = useReactionStore(state => state.reactions);

  const getReactionMeta = (code?: string) =>
    reactions.find((r: { code: string | undefined; }) => r.code === code);


  const viewedRef = useRef<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const handleViewPost = async (postId: number) => {
    if (viewedRef.current.has(postId)) return;

    viewedRef.current.add(postId);

    try {
      await Posts.viewPost(postId);

      setDataPost(prev =>
        prev.map(p =>
          p.id === postId ? { ...p, views: p.views + 1 } : p
        )
      );
    } catch (err) {
      console.error("view post failed", err);
    }
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const postId = Number(entry.target.getAttribute("data-post-id"));
          if (!postId) return;

          if (entry.isIntersecting) {
            // thấy post → đếm 2s
            const timer = setTimeout(() => {
              handleViewPost(postId);
            }, 2000);

            timersRef.current.set(postId, timer);
            console.log(1);
          } else {
            // lướt đi nhanh → hủy
            const timer = timersRef.current.get(postId);
            if (timer) {
              clearTimeout(timer);
              timersRef.current.delete(postId);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    return () => {
      observerRef.current?.disconnect();
      timersRef.current.forEach(t => clearTimeout(t));
      timersRef.current.clear();
    };
  }, []);

  const setPostRef = (
    node: HTMLDivElement | null,
    isLastPost: boolean
  ) => {
    if (!node) return;

    // observer cũ
    if (observerRef.current) {
      observerRef.current.observe(node);
    }

    // infinite scroll chỉ quan tâm post cuối
    if (infiniteObserverRef.current && isLastPost) {
      infiniteObserverRef.current.observe(node);
    }
  };


  return (
    <div className="mt-28">
      {mes && (
        <>{mes}</>
      )}
      <h1>Chat Realtime</h1>
      <Conversation />
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        className="border p-2"
      />

      {/* <button onClick={sendMessage} className="bg-blue-600 text-white p-2 ml-2">
        Send

                  // ref={(node) => {
          //   if (node && observerRef.current) {
          //     observerRef.current.observe(node);
          //   }
          // }}
      </button> */}

      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
      {dataPost.map((post, index) => {
        const type = getPostType(post);
        const reactionIcons = post.reactions.detail
          ?.filter(d => d.count > 0)
          .map(d => d.icon);
        const formatNumber = (num: number) => {
          if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
          if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
          return num.toString();
        };
        const isLastPost = index === dataPost.length - 1;
        return (
          <div key={post?.id ?? Math.random()} data-post-id={post.id}
            ref={(node) => setPostRef(node, isLastPost)}
          >
            <div className="max-w-xl mx-auto mt-6 bg-white rounded-xl shadow border">
              <div className="flex items-start justify-between p-4">
                <div className="flex gap-3">
                  <img
                    src={post.User?.avatUrl || image_vavart_null.src}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{post.User?.username}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="mt-1">{formatDateTime(post.createdAt)}</span>
                      <Globe size={12} className="mt-1" />
                    </div>
                  </div>
                </div>
                <MoreHorizontal className="text-gray-500 cursor-pointer" />
              </div>
              {type === 'TEXT' && (
                <PostContent content={post.content} />
              )}
              {type === 'BACKGROUND' && (
                <div
                  className="h-[330px] text-white flex items-center justify-center"
                  style={{ backgroundColor: post.backgroundColor! }}
                >
                  <p className="px-[50px] text-[25px] font-semibold w-full text-center whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

              )}
              {type === "FILE" && post.fileUrl && (() => {
                const fileType = getFileType(post.fileUrl);
                const config = FILE_CONFIG[fileType];
                const fileName =
                  post.fileName || getFileNameFromUrl(post.fileUrl);

                return (
                  <div>
                    <div className="mb-3">
                      <PostContent content={post.content} />
                    </div>
                    <a
                      href={post.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gray-200 hover:bg-gray-100 transition"
                    >
                      <div
                        className={`w-13 h-11 flex items-center justify-center rounded border ${config.bg}`}
                      >
                        <span className={`font-bold text-xs ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase font-bold">
                          {config.label}
                        </p>
                        <p className="font-medium text-sm truncate flex-1 min-w-0">
                          {post.fileName || getFileNameFromUrl(post.fileUrl)}
                        </p>
                      </div>
                    </a>
                  </div>
                );
              })()}



              {type === "MEDIA" && (
                <div className="w-full">
                  <PostContent content={post.content} />

                  <div className="mt-2">
                    {post.mediaType === "image" ? (
                      <img
                        src={post?.mediaUrl || image_vavart_null.src}
                        alt="media"
                        className="w-full max-h-[72vh] object-contain bg-black"
                      />
                    ) : post.mediaType === "video" ? (
                      <video
                        src={post.mediaUrl || image_vavart_null.src}
                        controls
                        className="w-full max-h-[72vh] object-contain bg-black"
                      />
                    ) : null}
                  </div>
                </div>
              )}

              <div className="flex mt-2 justify-between items-center px-4 py-2 text-sm text-gray-500">
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  {post.reactions.detail.map(d => {
                    const meta = getReactionMeta(d.code);
                    if (!meta) return null;
                    return <span key={d.code}>{meta.icon}</span>;
                  })}

                  <span className="ml-1">
                    {formatNumber(post.reactions.total)}
                  </span>
                  <span className="ml-1">
                    {formatNumber(post.reactions.total)}
                  </span>
                </span>


                <span>23 bình luận · 669 lượt chia sẻ</span>
              </div>

              <div className="border-t" />
              <div className="flex justify-around py-2 text-sm text-gray-600">
                <div className="flex-1">
                  {/* <LinkeButton /> */}
                  {/* <LinkeButton myReaction={post.myReaction} postId={post.id} /> */}
                  <LinkeButton
                    postId={post.id}
                    myReaction={post.myReaction}
                    onReact={(result: ReactionResult) =>
                      handleReact(post.id, result)
                    }
                  />
                </div>

                <div className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600">
                    <MessageCircle size={18} />
                    Bình luận
                  </button>
                </div>

                <div className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600">
                    <Share2 size={18} />
                    Chia sẻ
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={loadMoreRef} className="h-10" />

      {loading && (
        <div className="text-center py-4 text-gray-500">
          Đang tải thêm bài viết...
        </div>
      )}


    </div>
  );
}
