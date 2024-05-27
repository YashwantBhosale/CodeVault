import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { iconSrcList } from "../utils/icons";

const ChatroomDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user.username;
  const avatar = user.avtar;
  const [roomId, setRoomId] = useState("");
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const nav = useNavigate();

  const createRoom = () => {
    const socket = new WebSocket("wss://socket-io-codevault-1.onrender.com");

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "createRoom", payload: { username, avatar } }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { type, payload } = data;
      if (type === "roomId") {
        nav(`/room/${payload}`);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("Error creating room. Please try again.");
    };
  };

  const joinRoom = () => {
    if (roomId === "") {
      toast.error("Please Enter a Room ID");
    } else {
      nav(`/room/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl md:text-4xl font-bold mb-8 ">Let's Interact with People!</h1>
      <div className="p-6 bg-white w-fit max-w-2xl rounded-lg shadow-lg text-black">
        <div className="flex items-center mb-6">
          <img
            src={avatar?.length > 15 ? avatar : iconSrcList[avatar]}
            alt="avatar"
            className="w-16 h-16 mr-4 rounded-full"
          />
          <h1 className="text-3xl font-bold">Welcome, {username}</h1>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4 justify-between space-y-4 md:space-y-0">
          <button
            className="p-4 w-full md:w-auto bg-black text-white rounded-lg hover:bg-gray-800"
            onClick={() => setShowCreatePopup(true)}
          >
            Create Room
          </button>
          <button
            className="p-4 w-full md:w-auto bg-black text-white rounded-lg hover:bg-gray-800"
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
              className="bg-white p-8 rounded-xl w-full max-w-md m-4"
            >
              <h2 className="mb-4 text-xl font-bold">Click Continue to Create a Room</h2>
              <button
                className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 mr-4"
                onClick={createRoom}
              >
                Continue
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
              className="bg-white p-8 rounded-xl w-full max-w-md m-4"
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
