import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import {
  FaUser,
  FaRegArrowAltCircleUp,
  FaRegArrowAltCircleDown,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { iconSrcList } from "../utils/icons";
import { useNavigate } from "react-router-dom";

export const Explore = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  async function Upvote(e, post) {
    e.preventDefault();
    e.stopPropagation();
    try {
      let userObj = {
        username: user.username,
        avtar: user.avtar,
      };
      if (post.upvotes.some(obj => obj.username == user.username)) {
        return;
      }
      e.target.lastElementChild.innerHTML = post.upvotes.length + 1;
      post.upvotes.push({
        username: user.username,
        avtar: user.avtar,
      });
      if (post.downvotes.some(obj => obj.username == user.username)) {
        e.target.nextSibling.lastElementChild.innerHTML =
          post.downvotes.length - 1;
        post.downvotes = post.downvotes.filter(
          (obj) => obj.username !== user.username
        );
      }
      let response = await fetch(
        "http://localhost:4000/api/public/updateupvotes",
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

      if (post.downvotes.some(obj => obj.username == user.username)) {
        return;
      }
      
      e.target.lastElementChild.innerHTML = post.downvotes.length + 1;
      post.downvotes.push(userObj);
      if (post.upvotes.some(obj => obj.username == user.username)) {
        e.target.previousSibling.lastElementChild.innerHTML =
          post.upvotes.length - 1;
        post.upvotes = post.upvotes.filter(
          (obj) => obj.username !== user.username
        );
      }

      let response = await fetch("http://localhost:4000/api/public/updatedownvotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: post._id, userObj }),
      });

      if(response.ok){
        toast.success("added to downvoted posts");
      }else{
        toast.error("error downvoting post");
      }
    } catch (error) {
      console.log("error downvoting post : ", error.message);
    }
  }

  async function fetchPublicPosts() {
    try {
      const response = await fetch(
        "http://localhost:4000/api/public/getpublicposts",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      const data = await response.json();
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchPublicPosts();
  }, []);

  function handleCommentSubmit(e, id) {}

  function createPostsDiv(post, id) {
    return (
      <div
        key={id}
        className="w-[90%] mx-auto border border-gray-300 p-4 my-4 rounded-lg shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]" // shadow-[rgba(0,_0,_0,_0.2)_0px_10px_10px]
        style={{ zIndex: -99 }}
      >
        <p className="flex items-center gap-2 text-black text-xl font-bold mb-2 border-b border-gray-200 p-4">
          {(
            <img
              src={iconSrcList[post.author.avtar]}
              className="hoverZoomLink w-8 h-8 rounded-full object-cover mx-3"
            />
          ) || <FaUser className="border border-black p-1 rounded-full" />}
          {post.author.username}
        </p>
        <h1 className="text-xl my-7">
          <p
            style={{ width: "95%", margin: "10px auto" }}
            className="font-semibold"
          >
            {" "}
            {post.title || "Awesome Title"}
          </p>
        </h1>
        <h1 className="text-xl">
          <span className="font-semibold"> </span>
          <p
            style={{ width: "95%", margin: "10px auto", marginTop: 0 }}
            className="bg-light-off-white border border-gray-200 p-4"
          >
            {post.description || "this is a description."}
          </p>
        </h1>
        <div className="flex items-center justify-evenly">
          <div
            className="flex items-center gap-4 cursor-pointer z-99 my-2"
            onClick={e => Upvote(e, post)}
          >
            <FaRegArrowAltCircleUp
              style={{ zIndex: -1 }}
              className="text-green-500 text-xl "
            />{" "}
            <span style={{ zIndex: -1 }} className="font-bold ">
              {post.upvotes.length}
            </span>
          </div>
          <div
            className="flex items-center z-99 gap-4 cursor-pointer"
            onClick={e => Downvote(e, post)}
          >
            <FaRegArrowAltCircleDown
              style={{ zIndex: -1 }}
              className="text-red-500 text-xl -z-1"
            />{" "}
            <span style={{ zIndex: -1 }} className="font-bold -z-1">
              {post.downvotes.length}
            </span>
          </div>
        </div>
        <form onSubmit={(e) => handleCommentSubmit(e, id)} className="mt-4">
          <h1 className="text-lg font-bold">Comments</h1>
          <div className="flex justify-between">
            <input
              placeholder="Add a comment"
              name="comment"
              type="text"
              className="border border-gray-300 rounded-md p-2 w-3/4 mt-2"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-md mt-2 hover:bg-slate-700"
            >
              POST
            </button>
          </div>
        </form>
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded-md mt-4"
          onClick={() => navigate(`/viewpost?id=${post._id}&avtar=${post.author.avtar}`)}
        >
          Comments
        </button>
      </div>
    );
  }

  return (
    <div className="mt-[10vh] mb-[10vh]">
      <h1 className="mx-[10vw]">Explore</h1>
      {posts.map((post, index) => createPostsDiv(post, index))}
    </div>
  );
};
