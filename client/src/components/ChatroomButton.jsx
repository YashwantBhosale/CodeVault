import React from "react";
import { FaCommentAlt, FaCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router";

export const ChatroomButton = () => {
  const navigate = useNavigate();
  return (
    <span
      title="Enter Chatroom"
      className="fixed w-[50px] h-[50px] bottom-[10vh] right-[7vw] w-10 h-10 text-gray-500 hover:text-gray-700 cursor-pointer bg-black text-white rounded-full flex items-center justify-center p-2 text-6xl"
      onClick={() => navigate("/chatroom")}
    >
      <FaCommentDots/>
    </span>
  );
};
