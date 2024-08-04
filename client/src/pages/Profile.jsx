import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

import "./profile.css";
import { FaUser, FaWindowClose } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { iconSrcList } from "../utils/icons";
export const Profile = () => {
  const [userobj, setuserobj] = useState(null);
  const [followerspopup, setfollowerspopup] = useState(false);
  const [followingpopup, setfollowingpopup] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();
  const { logout } = useLogout();

  function removeLocalFollower(userObj) {
    user.followers = user.followers.filter(
      (User) => userObj.username != User.username
    );
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "UPDATE", payload: user });
  }

  async function handleRemoveFollower(userObj) {
    removeLocalFollower(userObj);
    try {
      const response = await fetch(BASE_URL + "api/user/removefollower", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          username: user.username,
          followObj: userObj,
        }),
      });
      if (response.ok) {
        toast.success("Follower removed successfully!");
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Error removing follower!");
    }
  }

  function localFollow(e, userObj) {
    if (userObj.username == user.uername) {
      toast.info("You cannot follow Yourself!");
      return;
    }
    switch (e.target.innerText) {
      case "Follow": {
        if (user.following.some((User) => userObj.username == User.username)) {
          toast.info("You are already following this user!");
          return;
        }
        user.following.push(userObj);
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: "UPDATE", payload: user });
        return;
      }
      case "Following": {
        user.following = user.following.filter(
          (User) => userObj.username != User.username
        );
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: "UPDATE", payload: user });
        return;
      }
      default: {
        toast.warn("Unexpected Behaviour!");
        return;
      }
    }
  }

  async function handleFollowButton(e, userobj) {
    console.log(e.target.innerText);
    if (userobj.username == user.username) {
      toast.info("You cannot follow Yourself!");
      return;
    }
    localFollow(e, userobj);
    switch (e.target.innerText) {
      case "Follow": {
        try {
          const response = await fetch(BASE_URL + "api/user/follow", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              username: user.username,
              followObj: userobj,
            }),
          });
          if (response.ok) {
            toast.success("Follow successful!");
          }
        } catch (error) {
          console.error(error.message);
          toast.error("Error following user!");
        }
        return;
      }
      case "Following": {
        try {
          const response = await fetch(BASE_URL + "api/user/unfollow", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              username: user.username,
              followObj: userobj,
            }),
          });
          if (response.ok) {
            toast.success("Unfollow successful!");
          }
        } catch (error) {
          console.error(error.message);
          toast.error("Error unfollowing user!");
        }
        return;
      }
      default: {
        toast.warn("Unexpected Behaviour!");
        return;
      }
    }
  }

  return (
    <>
      <div
        className="text-white min-h-screen flex justify-center items-center"
        style={{
          backgroundColor: "#fff",
          opacity: 0.8,
          backgroundImage:
            "radial-gradient(#000 1px, transparent 1px), radial-gradient(#000 1px, #fff 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      >
        <div className="profile-box-container">
          <aside class="profile-card">
            <header>
              <a href="">
                <img
                  src={
                    (user?.avtar.length > 15
                      ? user.avtar
                      : iconSrcList[user?.avtar]) ||
                    "https://avataaars.io/?accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&facialHairColor=Platinum&clotheType=ShirtScoopNeck&clotheColor=White&eyeType=Happy&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Light"
                  }
                  class="hoverZoomLink"
                />
              </a>
              <h1 className="font-bold">{user?.username}</h1>
              <h2>{user?.email}</h2>
            </header>
            <div class="profile-bio">
              <div>
                <h1 className="font-bold">About me:</h1>
                <p>{user?.about || "I like to Code!"}</p>
              </div>
              <div className="flex w-full justify-between">
                <div
                  className="flex flex-col items-center justify-between cursor-pointer"
                  onClick={() => setfollowerspopup(true)}
                >
                  <p className="text-2xl">{user?.followers?.length}</p>
                  <h3 className="font-bold">Followers</h3>
                </div>
                <div
                  className="flex flex-col items-center justify-between cursor-pointer"
                  onClick={() => setfollowingpopup(true)}
                >
                  <p className="text-2xl">{user?.following?.length}</p>
                  <h3 className="font-bold ">Following</h3>
                </div>
              </div>
              <button
                className="logout-btn hover:bg-slate-600"
                onClick={async () => {
                  try {
                    logout();
                    navigate("/login");
                    toast.success("Successfully logged out!");
                  } catch (e) {
                    console.error(e.message);
                    toast.error(
                      "we are having trouble logging you out! Please try again!"
                    );
                  }
                }}
              >
                Logout
              </button>
            </div>
          </aside>
        </div>
      </div>
      <AnimatePresence>
        {followerspopup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-50"
          >
            <motion.div
              initial={{ y: "-100vh" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="bg-white p-8 rounded-xl lg:w-2/5 m-[20px]"
            >
              <button
                onClick={() => setfollowerspopup(false)}
                className="absolute top-2 right-2"
              >
                <FaWindowClose />
              </button>
              <h2 className="text-xl font-bold mb-4">Followers</h2>
              {user?.followers.map((follower) => (
                <div
                  key={follower.uid}
                  className="flex items-center mb-2 justify-between"
                  style={{
                    borderBottom: "1px solid #92929291",
                    padding: "5px 0",
                  }}
                >
                  {/* <FaUser
                    style={{
                      border: "1px solid black",
                      padding: 4,
                      borderRadius: "50%",
                      boxSizing: "content-box",
                      marginRight: "1vw",
                    }}
                  /> */}
                  <p className="flex gap-3">
                    <img
                      src={
                        follower?.avtar?.length > 15
                          ? follower.avtar
                          : iconSrcList[follower.avtar]
                      }
                      className="hoverZoomLink w-8 h-8 rounded-full object-cover mx-3"
                    />
                    {follower.username}
                    {/* <hr
                      style={{
                        color: "black",
                        borderColor: "black",
                        height: "5px",
                      }}
                    /> */}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleFollowButton(e, follower)}
                      className={`block mx-[5px] ${
                        user?.following.includes(follower)
                          ? "bg-transparent text-black-700"
                          : "bg-black-700"
                      } hover:bg-grey-800 font-semibold py-2 px-4 border border-black text-black-700 rounded`}
                    >
                      {(user?.following.includes(follower) && "Following") ||
                        "Follow"}
                    </button>
                    <button title="Remove Follower">
                      <a
                        href="#"
                        onClick={() => handleRemoveFollower(follower)}
                      >
                        &#x2715;
                      </a>
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {followingpopup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-50"
          >
            <motion.div
              initial={{ y: "-100vh" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="bg-white p-8 rounded-xl lg:w-2/5 m-[20px]"
            >
              <button
                onClick={() => setfollowingpopup(false)}
                className="absolute top-2 right-2"
              >
                <FaWindowClose />
              </button>
              <h2 className="text-xl font-bold mb-4">Following</h2>
              {user?.following.map((followinguser) => (
                <div
                  key={followinguser.uid}
                  className="flex items-center mb-2 justify-between"
                  style={{
                    borderBottom: "1px solid #92929291",
                    padding: "5px 0",
                  }}
                >
                  {/* <FaUser
                    style={{
                      border: "1px solid black",
                      padding: 4,
                      borderRadius: "50%",
                      boxSizing: "content-box",
                      marginRight: "1vw",
                    }}
                  /> */}
                  <p className="flex gap-3">
                    <img
                      src={
                        followinguser?.avtar?.length > 15
                          ? followinguser.avtar
                          : iconSrcList[followinguser.avtar]
                      }
                      className="hoverZoomLink w-8 h-8 rounded-full object-cover mx-3"
                    />
                    {followinguser.username}{" "}
                    {/* <hr
                      style={{
                        color: "black",
                        borderColor: "black",
                        height: "5px",
                      }} 
                      
                    />
                      */}
                  </p>
                  <button
                    onClick={(e) => handleFollowButton(e, followinguser)}
                    className={`block mx-[5px] ${
                      user?.following.includes(followinguser)
                        ? "bg-transparent text-black-700"
                        : "bg-black text-white"
                    } hover:bg-grey-800 font-semibold py-2 px-4 border border-black rounded`}
                  >
                    {(user?.following.includes(followinguser) && "Following") ||
                      "Follow"}
                  </button>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {editProfileOpen && (
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl w-4/5 m-[20px] p-5">
            <h2 className="text-xl font-bold mb-4">Edit Your Profile</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Username
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  type="text"
                  disabled
                  value={user?.username}
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  className="w-full border border-gray-300rounded-md px-3 py-2 mt-1"
                  type="email"
                  disabled
                  value={user?.email}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  About
                </label>
                <textarea
                  value={user?.about}
                  className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => {
                    setuserobj({ ...userobj, about: e.target.value });
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Avatar
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  type="text"
                  disabled
                  value={user?.avtar}
                />
              </div>
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded-md mr-4"
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-slate-700"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
