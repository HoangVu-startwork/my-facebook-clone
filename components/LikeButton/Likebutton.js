import "./css.css";
import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
import Likebuttons from "@/service/reaction";
import { useReactionStore } from "@/service/service-once/PostState";


  
export default function LikeButton({ myReaction, postId, onReact}) {
    const [open, setOpen] = useState(false);
    const [reaction, setReaction] = useState(null);

    const reactions = useReactionStore(state => state.reactions);
    const fetchReactions = useReactionStore(state => state.fetchReactions);

    useEffect(() => {
        fetchReactions();
    }, []);

    useEffect(() => {
        if (myReaction?.code !== reaction?.code) {
            setReaction(myReaction || null);
        }
    }, [myReaction]);
    
    const handleSelect = async (r) => {
        try {
            const res = await Likebuttons.reactPost({
                postId,
                reactionCode: r.code
            });

            const { status, reaction: newReactionCode } = res.data.data;
            const result = res.data.data;

            if (status === "removed") {
                setReaction(null);
            } else {
                const fullReaction = reactions.find(
                    item => item.code === newReactionCode
                );
                setReaction(fullReaction);
            }

            onReact?.(result);
            setOpen(false);

        } catch (err) {
            console.error("React failed", err);
        }
    };


    const isLiked = reaction?.code === "like";
    const likeReaction = reactions.find(r => r.code === "like");

    return (
        <div
            className="relative justify-center"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {open && reactions.length > 0 && (
                <div className="absolute -top-10 left-15 bg-white shadow-lg rounded-full px-2 py-1 flex gap-2 animate-fade-in z-10">
                    {reactions.map((r) => (
                        <button
                            key={r.id}
                            onClick={() => handleSelect(r)}
                            className="text-2xl hover:scale-125 transition-transform"
                            title={r.label}
                        >
                            {r.icon || "👍"}
                        </button>
                    ))}
                </div>
            )}
            <button
                onClick={() => {
                    if (reaction) {
                        handleSelect(reaction); // gửi lại cùng reaction → backend sẽ remove
                    } else if (likeReaction) {
                        handleSelect(likeReaction);
                    }
                }}

                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 ${reaction ? reaction.color || "text-blue-600" : "text-gray-600"
                    }`}
            >
                {reaction && reaction.code !== "like" ? (
                    <>
                        <span className="like-thumbsUp">{reaction.icon}</span>
                        <span className={reaction.color}>{reaction.label}</span>
                    </>
                ) : (
                    <>
                        <ThumbsUp className={`like-thumbsUps ${isLiked ? "text-blue-600" : ""}`} />
                        <span className={isLiked ? "text-blue-600" : ""}>Thích</span>
                    </>
                )}
            </button>
        </div>
    );
}


