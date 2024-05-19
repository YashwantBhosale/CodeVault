import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import {
  FaUser,
  FaRegArrowAltCircleUp,
  FaRegArrowAltCircleDown,
  FaComment,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { iconSrcList } from "../utils/icons";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "../components/Autocomplete";

export const Explore = () => {
  const [posts, setPosts] = useState([]);
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [allstudents, setAllStudents] = useState([]);
  const [mostfollowed, setmostfollowed] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  async function fetchAllUsers() {
    try {
      const response = await fetch(
        BASE_URL+"api/public/getallusers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setAllStudents(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchMostFollowed() {
    try {
      const response = await fetch(
        BASE_URL+"api/public/mostfollowed",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setmostfollowed(data);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function Upvote(e, post) {
    e.preventDefault();
    e.stopPropagation();
    try {
      let userObj = {
        username: user.username,
        avtar: user.avtar,
      };
      if (post.upvotes.some((obj) => obj.username == user.username)) {
        return;
      }
      e.target.lastElementChild.innerHTML = post.upvotes.length + 1;
      post.upvotes.push({
        username: user.username,
        avtar: user.avtar,
      });
      if (post.downvotes.some((obj) => obj.username == user.username)) {
        e.target.nextSibling.lastElementChild.innerHTML =
          post.downvotes.length - 1;
        post.downvotes = post.downvotes.filter(
          (obj) => obj.username !== user.username
        );
      }
      let response = await fetch(
        BASE_URL+"api/public/updateupvotes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: post._id, userObj }),
        }
      );
      if (response.ok) {
        toast.success("added to upvoted posts");
      } else {
        toast.error("error upvoting post");
      }
    } catch (error) {
      console.log("error upvoting post : ", error.message);
    }
  }

  async function Downvote(e, post) {
    e.preventDefault();
    e.stopPropagation();
    try {
      let userObj = {
        username: user.username,
        avtar: user.avtar,
      };

      if (post.downvotes.some((obj) => obj.username == user.username)) {
        return;
      }

      e.target.lastElementChild.innerHTML = post.downvotes.length + 1;
      post.downvotes.push(userObj);
      if (post.upvotes.some((obj) => obj.username == user.username)) {
        e.target.previousSibling.lastElementChild.innerHTML =
          post.upvotes.length - 1;
        post.upvotes = post.upvotes.filter(
          (obj) => obj.username !== user.username
        );
      }

      let response = await fetch(
        BASE_URL+"api/public/updatedownvotes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: post._id, userObj }),
        }
      );

      if (response.ok) {
        toast.success("added to downvoted posts");
      } else {
        toast.error("error downvoting post");
      }
    } catch (error) {
      console.log("error downvoting post : ", error.message);
    }
  }

  async function fetchPublicPosts() {
    try {
      const response = await fetch(
        BASE_URL+"api/public/getpublicposts",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAllUsers();
    fetchMostFollowed();
    fetchPublicPosts();
  }, []);

  function localFollow(e, userObj) {
    switch (e.target.innerText) {
      case "Follow": {
        user.following.push(userObj);
        console.log(user);
        dispatch({ type: "UPDATE", payload: user });
        return;
      }
      case "Unfollow": {
        user.following = user.following.filter(
          (User) => userObj.username != User.username
        );
        console.log(user);
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
    localFollow(e, userobj);
    switch (e.target.innerText) {
      case "Follow": {
        try {
          const response = await fetch(
            BASE_URL+"api/user/follow",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                username: user.username,
                followObj: userobj,
              }),
            }
          );
          if (response.ok) {
            toast.success("Follow successful!");
          }
        } catch (error) {
          console.error(error.message);
          toast.error("Error following user!");
        }
        return;
      }
      case "Unfollow": {
        try {
          const response = await fetch(
            BASE_URL+"api/user/unfollow",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                username: user.username,
                followObj: userobj,
              }),
            }
          );
          if (response.ok) {
            toast.success("Follow successful!");
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

  function handleCommentSubmit(e, id) {}

  function createMostFollowedUsersDiv(userobj) {
    return (
      <div class="w-[18vw] min-w-[250px] my-2 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center h-[90%]">
        <div class="mb-8">
          <img
            class="object-center object-cover rounded-full h-36 w-36"
            src={
              userobj?.avtar.length > 15
                ? userobj.avtar
                : iconSrcList[userobj?.avtar || "user"]
            }
            alt="photo"
          />
        </div>
        <div class="text-center">
          <p class="text-xl text-black font-bold mb-2">{userobj.username}</p>
          <button
            onClick={(e) => handleFollowButton(e, userobj)}
            className="px-4 py-2 bg-gray-800 text-white rounded-md mt-2 hover:bg-slate-700"
          >
            {user.following.some(
              (followingUser) => followingUser.username === userobj.username
            )
              ? "Unfollow"
              : "Follow"}
          </button>
        </div>
      </div>
    );
  }

  

  const calculateTimeAgo = (createdAt) => {
    const currentTime = new Date();
    const postTime = new Date(createdAt);
    const timeDifference = currentTime - postTime;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
    if (daysDifference > 0) {
      return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
    } else if (hoursDifference > 0) {
      return `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''} ago`;
    } else {
      return `${minutesDifference} minute${minutesDifference > 1 ? 's' : ''} ago`;
    }
  };
  function createPostsDiv(post, id) {
    return (
      <div
        key={id}
        className="w-[90%] md:w-[60%] mx-auto border border-gray-300 p-4 my-4 rounded-lg shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]" // shadow-[rgba(0,_0,_0,_0.2)_0px_10px_10px]
        style={{ zIndex: -99 }}
      >
        <p
          onClick={() =>
            navigate(`/viewprofile?username=${post.author.username}`)
          }
          className="flex items-center gap-2 text-black text-md font-bold mb-2 border-b border-gray-200 p-2"
        >
          {(
            <img
              src={
                post?.author?.avtar?.length > 15
                  ? post.author.avtar
                  : iconSrcList[post.author.avtar]
              }
              className="hoverZoomLink w-8 h-8 rounded-full object-cover mx-3"
            />
          ) || <FaUser className="border border-black p-1 rounded-full" />}
          {post.author.username}
          <span className="text-sm ml-2 text-gray-500">{calculateTimeAgo(post.createdAt)}</span>
        </p>
        <h1 className="text-xl mb-2">
          <p
            style={{ width: "95%", margin: "0 auto" }}
            className="font-bold text-md"
          >
            {" "}
            {post.title || "Awesome Title"}
          </p>
        </h1>
        <h1 className="text-xl">
          <span className="font-semibold"> </span>
          <p
            style={{ width: "95%", margin: "10px auto", marginTop: 0 }}
            className="bg-light-off-white border border-gray-200 p-4 text-sm"
          >
            {post.content || "this is a description."}
          </p>
        </h1>
        <div className="w-[40%] md:w-[30%] relative z-0 flex items-center justify-between mt-4 mx-[1.5vw]">
          <div className="w-full md:w-[70%] flex justify-between items-center bg-black p-2 rounded-md -z-50">
            <div
              className="flex items-center gap-1 cursor-pointer z-99"
              onClick={(e) => Upvote(e, post)}
            >
              <FaRegArrowAltCircleUp
                style={{ zIndex: -1 }}
                className="text-white text-xl "
              />{" "}
              <span style={{ zIndex: -1 }} className="font-bold text-white">
                {post.upvotes.length}
              </span>
            </div>
            <div
              className="flex items-center z-99 gap-1 cursor-pointer"
              onClick={(e) => Downvote(e, post)}
            >
              <FaRegArrowAltCircleDown
                style={{ zIndex: -1 }}
                className="text-white text-xl -z-1"
              />{" "}
              <span style={{ zIndex: -1 }} className="font-bold -z-1 text-white">
                {post.downvotes.length}
              </span>
            </div>
            <FaComment
              className="font-4xl mr-[5px] cursor-pointer"
              color="white"
              onClick={() =>
                navigate(`/viewpost?id=${post._id}&avtar=${post.author.avtar}`)
              }
              />
              </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[15vh] mb-[10vh]">
      <h1 className="text-center text-xl font-bold">Ready to Explore?</h1>
      <Autocomplete data={allstudents}  />

      <div className="my-6 flex items-center flex-col md:flex-row overflow-x-auto no-scrollbar gap-5 w-[70%] mx-auto px-4 h-[42vh]">
        {mostfollowed.map(createMostFollowedUsersDiv)}
      </div>

      {posts.map((post, index) => createPostsDiv(post, index))}
    </div>
  );
};
