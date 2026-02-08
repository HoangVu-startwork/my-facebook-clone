import { useEffect, useRef } from "react";
// Hook này làm 3 việc: Khi post lọt vào màn hình, Đếm 2 giây, Gọi API 1 lần duy nhất
export function usePostView(postId, onView) {
    const ref = useRef(null);
    const viewed = useRef(false);
    const timer = useRef(null);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !viewed.current) {
                    timer.current = setTimeout(() => {
                        viewed.current = true;
                        onView(postId);
                    }, 2000); // ⏱ 2 giây
                } else {
                    if (timer.current) {
                        clearTimeout(timer.current);
                        timer.current = null;
                    }
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(ref.current);

        return () => {
            observer.disconnect();
            if (timer.current) clearTimeout(timer.current);
        };
    }, [postId]);

    return ref;
}