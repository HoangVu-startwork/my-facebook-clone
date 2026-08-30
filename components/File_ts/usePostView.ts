import { useEffect, useRef } from "react";

interface UsePostViewProps {
    onView: (postId: number) => void | Promise<void>;
}

export function usePostView({ onView }: UsePostViewProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);

    const viewedRef = useRef<Set<number>>(new Set());

    const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
        new Map()
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const postId = Number(
                        entry.target.getAttribute("data-post-id")
                    );

                    if (!postId) return;

                    if (entry.isIntersecting) {
                        // Đã view rồi
                        if (viewedRef.current.has(postId)) {
                            return;
                        }

                        // Đang đếm 2 giây
                        if (timersRef.current.has(postId)) {
                            return;
                        }

                        // Bắt đầu đếm 2 giây
                        const timer = setTimeout(() => {
                            timersRef.current.delete(postId);

                            if (!viewedRef.current.has(postId)) {
                                viewedRef.current.add(postId);
                     
                                onView(postId);
                            }
                        }, 2000);

                        timersRef.current.set(postId, timer);
                    } else {
                        // Ra khỏi màn hình trước 2 giây
                        const timer = timersRef.current.get(postId);

                        if (timer) {
                            clearTimeout(timer);
                            timersRef.current.delete(postId);
                        }
                    }
                });
            },
            {
                threshold: 0.6,
            }
        );

        observerRef.current = observer;

        return () => {
            observer.disconnect();

            timersRef.current.forEach((timer) => {
                clearTimeout(timer);
            });

            timersRef.current.clear();
        };
    }, [onView]);

    /**
     * Gắn post vào View Observer
     */
    const setPostViewRef = (node: HTMLDivElement | null) => {
        if (!node) return;

        observerRef.current?.observe(node);
    };

    return {
        setPostViewRef,
    };
}