import { useState } from "react";
import "./css.css";


const PostContent = ({ content }) => {
    const MAX_LENGTH = 150;
    const [expanded, setExpanded] = useState(false);

    const isLong = content.length > MAX_LENGTH;
    const displayText =
        expanded || !isLong
            ? content
            : content.slice(0, MAX_LENGTH) + "...";

    return (
        <div className="post-content px-4">
            <p className="text-[18px] text-black whitespace-pre-line">
                {displayText} {isLong && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-blue-600 text-[17px] mt-1 hover:underline"
                    >
                        {expanded ? "Thu gọn" : "Xem thêm"}
                    </button>
                )}
            </p>
        </div>
    );
};

export default PostContent;
