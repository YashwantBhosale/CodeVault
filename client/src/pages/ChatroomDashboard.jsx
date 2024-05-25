import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { iconSrcList } from "../utils/icons";

const socket = io(process.env.REACT_APP_BASE_URL);

const ChatroomDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user.username;
  const avatar = user.avtar;
  const [roomId, setRoomId] = useState("");
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const nav = useNavigate();

  const createRoom = () => {
    socket.emit("createRoom", { username, avatar }, (roomId) => {
      nav(`/room/${roomId}`);
    });
  };

  const joinRoom = () => {
    if (roomId === "") {
      toast.error("Please Enter a Room ID");
    } else {
      nav(`/room/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="p-6 bg-white w-[90%] md:w-fit rounded-lg shadow-lg text-black">
        <div className="flex items-center mb-4">
          <img
            src={avatar?.length > 15 ? avatar : iconSrcList[avatar]}
            alt="avatar"
            className="w-10 h-10 mr-2 rounded-full"
          />
          <h1 className="text-2xl font-bold">Welcome, {username}</h1>
        </div>
        <div className="flex space-x-4 justify-between">
          <button
            className="p-2 bg-black text-white rounded-lg hover:bg-gray-800"
            onClick={() => setShowCreatePopup(true)}
          >
            Create Room
          </button>
          <button
            className="p-2 bg-black text-white rounded-lg hover:bg-gray-800"
            onClick={() => setShowJoinPopup(true)}
          >
            Join Room
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showCreatePopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-50"
          >
            <motion.div
              initial={{ y: "-100vh" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="bg-white p-8 rounded-xl lg:w-2/5 m-[20px]"
            >
              <h2 className="mb-4 text-xl font-bold">Create a Room</h2>
              <button
                className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 mr-4"
                onClick={createRoom}
              >
                Continue to Create a Chatroom
              </button>
              <button
                className="p-2 mt-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={() => setShowCreatePopup(false)}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}

        {showJoinPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-50"
          >
            <motion.div
              initial={{ y: "-100vh" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="bg-white p-8 rounded-xl lg:w-2/5 m-[20px]"
            >
              <h2 className="mb-4 text-xl font-bold">Join a Room</h2>
              <input
                type="text"
                placeholder="Enter Room Code"
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button
                className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 mr-4"
                onClick={joinRoom}
              >
                Join Room
              </button>
              <button
                className="p-2 mt-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={() => setShowJoinPopup(false)}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatroomDashboard;
