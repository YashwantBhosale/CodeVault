import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "tailwindcss/tailwind.css";
import { iconSrcList } from "../utils/icons";

const Room = ({ allStudents }) => {
  const { roomId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user.username;
  const avatar = user.avtar;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    socketRef.current = new WebSocket("wss://socket-io-codevault-1.onrender.com");
    socketRef.current.onopen = () => {
      socketRef.current.send(JSON.stringify({
        type: "joinRoom",
        payload: { roomId, username, avatar }
      }));
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { type, payload , messages } = data;
      console.log(data);
      if (type === "roomData") {
        setUsers(payload);
      } else if (type === "message") {
        setMessages((messages) => [...messages, payload]);
      } else if (type === "existingMessages") {
        setMessages(messages);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomId, username, avatar]);

  const sendMessage = () => {
    if (message.trim()) {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: "sendMessage",
          payload: { roomId, message, username, avatar}
        }));
        setMessage("");
      } else {
        toast.error("Connection not ready. Please wait...");
      }
    }
  };

  const inviteStudent = async (student) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BASE_URL + "api/user/invite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: student.email,
            roomId,
            username,
          }),
        }
      );

      if (response.ok) {
        toast.success(`Invitation sent to ${student.username}`);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Error sending invitation");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col md:flex-row h-[calc(93vh-40px)] bg-gray-900 text-gray-100 mt-[11vh]">
      <div className="flex flex-col flex-grow">
        <div className="flex-grow p-4 h-[30vh] overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {messages?.length > 0 && messages?.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.user === username ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs shadow-lg ${msg.user === username ? "bg-blue-600 text-white" : "bg-gray-700"}`}
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={msg.avatar?.length > 15 ? msg.avatar : iconSrcList[msg.avatar]}
                      alt="avatar"
                      className="w-6 h-6 rounded-full"
                    />
                    <p>{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div >
        </div>
        <div className="flex p-4 bg-gray-800" style={{ marginBottom: "40px" }}>
          <input
            type="text"
            className="flex-grow p-2 mr-4 w-[100%] bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
      <div className="w-full md:w-1/4 p-4 bg-gray-800 overflow-y-scroll pb-[10vh]">
        <h2 className="mb-4 text-xl font-bold">Users in Room</h2>
        <ul className="space-y-2">
          {users
            .filter((user) => user.username.length > 0)
            .map((user, index) => (
              <li
                key={index}
                className="flex items-center p-2 my-[2px] bg-gray-700 rounded-lg shadow-md"
              >
                <img
                  src={user.avatar.length > 15 ? user.avatar : iconSrcList[user.avatar]}
                  alt="avatar"
                  className="w-6 h-6 mr-2 rounded-full"
                />
                {user.username}
              </li>
            ))}
        </ul>
        <h2 className="mb-4 text-xl font-bold mt-4">Invite Users to Chat</h2>
        <ul className="space-y-2">
          {allStudents
            .filter(
              (student) => !users.some((user) => user.username === student.username)
            )
            .map((student, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 my-[2px] bg-gray-700 rounded-lg shadow-md"
              >
                <div className="flex items-center">
                  <img
                    src={student.avtar.length > 15 ? student.avtar : iconSrcList[student.avtar]}
                    alt="avatar"
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                  {student.username}
                </div>
                <button
                  className="px-2 py-1 bg-gray-900 rounded-lg hover:bg-gray-800"
                  onClick={() => inviteStudent(student)}
                >
                  Invite
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Room;
