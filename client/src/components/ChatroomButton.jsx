import React from "react";
import { FaCommentAlt, FaCommentDots, FaFacebookMessenger } from "react-icons/fa";
import { useNavigate } from "react-router";

export const ChatroomButton = () => {
  const navigate = useNavigate();
  return (
    <span
      title="Enter Chatroom"
      className="fixed w-[50px] h-[50px] bottom-[10vh] right-[1vw] w-10 h-10 text-gray-500 cursor-pointer bg-black text-white rounded-full flex items-center justify-center p-2 text-6xl"
      onClick={() => navigate("/chatroom")}
    >
      <FaFacebookMessenger/>
    </span>
  );
};
