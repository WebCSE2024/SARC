import React, { useState, useEffect } from "react";
import defaultUserImg from "../../../public/NoProfileImg.png";

const CommentInput = ({
  onSubmit,
  placeholder = "Write a comment...",
  initialValue = "",
  onChange = null,
}) => {
  const [text, setText] = useState(initialValue);

  // Update text if initialValue changes (for reply prefill)
  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    // Call onChange prop if provided
    if (onChange) {
      onChange(newText);
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="comment-input-container">
      <img src={defaultUserImg} alt="User" className="user-image" />
      <div className="input-wrapper">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="comment-input"
          aria-label={placeholder}
        />
        <button
          className={`send-button ${text.trim() ? "active" : ""}`}
          onClick={handleSubmit}
          disabled={!text.trim()}
          aria-label="Send comment"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
