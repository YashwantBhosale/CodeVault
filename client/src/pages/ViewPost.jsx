import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import {
  FaFontAwesome,
  FaRegArrowAltCircleDown,
  FaRegArrowAltCircleUp,
  FaUser,
  FaRegComment,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { iconSrcList } from "../utils/icons";

export const ViewPost = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const user = useAuthContext().user;
  const navigate = useNavigate();

  async function fetchPost() {
    try {
      const response = await fetch(
        `http://localhost:4000/api/public/post?id=${id}`
      );
      const data = await response.json();
      console.log(data);
      setPost(data);
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to fetch post");
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
        "http://localhost:4000/api/public/updatedownvotes",
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

  async function fetchComments() {
    try {
      setComments(null);
      const response = await fetch(
        `http://localhost:4000/api/comment/getcomments?postId=${id}`
      );
      const data = await response.json();
      setComments(data);
      console.log(data);
      console.log(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments");
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get("comment");
    if (!content) {
      toast.error("Please enter a comment");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:4000/api/comment/addcomment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: id,
            content,
            username: user.username,
            avtar: user.avtar,
          }),
        }
      );
      if (response.ok) {
        toast.success("Comment posted successfully");
        fetchComments();
      } else {
        toast.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    }
  }

  function createCommentsDiv(comment) {
    return (
      <div
        key={comment._id}
        className="mx-auto border border-gray-300 p-4 my-4 rounded-lg shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]" // shadow-[rgba(0,_0,_0,_0.2)_0px_10px_10px]
        style={{ zIndex: -99 }}
      >
        <p
          onClick={() =>
            navigate(`/viewprofile?username=${comment.author.username}`)
          }
          className="flex items-center gap-2 text-black text-md font-bold mb-2 border-b border-gray-200 p-2"
        >
          {(
            <img
              src={
                comment?.author?.avtar?.length > 15
                  ? comment.author.avtar
                  : iconSrcList[comment.author.avtar]
              }
              className="hoverZoomLink w-8 h-8 rounded-full object-cover mx-3"
            />
          ) || <FaUser className="border border-black p-1 rounded-full" />}
          {comment.author.username}
          <span className="text-sm ml-2 text-gray-500">
            {calculateTimeAgo(comment.timestamp)}
          </span>
        </p>
        <h1 className="text-xl">
          <span className="font-semibold"> </span>
          <p
            style={{ width: "95%", margin: "10px auto", marginTop: 0 }}
            className="bg-light-off-white border border-gray-200 p-4 text-sm"
          >
            {comment.content || "this is a description."}
          </p>
        </h1>
        <div className="w-[50%] md:w-[30%] relative z-0 flex items-center justify-between mt-4 mx-[1.5vw]">
          <div className="w-full md:w-[70%] flex justify-between items-center p-2 rounded-md -z-50 text-black">
            <div
              className="flex items-center gap-1 cursor-pointer z-99"
              onClick={(e) => upvoteComment(e, comment)}
            >
              <FaRegArrowAltCircleUp
                style={{ zIndex: -1 }}
                className="text-xl "
              />{" "}
              <span style={{ zIndex: -1 }} className="font-bold">
                {comment.upvotes.length}
              </span>
            </div>
            <div
              className="flex items-center z-99 gap-1 cursor-pointer"
              onClick={(e) => downvoteComment(e, comment)}
            >
              <FaRegArrowAltCircleDown
                style={{ zIndex: -1 }}
                className="text-xl -z-1"
              />{" "}
              <span
                style={{ zIndex: -1 }}
                className="font-bold -z-1"
              >
                {comment.downvotes.length}
              </span>
            </div>
            <FaRegComment
              className="font-4xl mr-[5px] cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  }

  async function upvoteComment(e, comment) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const userObj = {
        id: user.id,
        username: user.username,
        avtar: user.avtar,
      };
      if (comment.upvotes.some((obj) => obj.username === user.username)) {
        return;
      }
      e.target.lastElementChild.innerHTML = comment.upvotes.length + 1;
      comment.upvotes.push(userObj);
      if (comment.downvotes.some((obj) => obj.username === user.username)) {
        e.target.nextSibling.lastElementChild.innerHTML = comment.downvotes.length - 1;
        comment.downvotes = comment.downvotes.filter((obj) => obj.username !== user.username);
      }
      const response = await fetch("http://localhost:4000/api/comment/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: comment._id, userObj }),
      });
      if (response.ok) {
        toast.success("Comment upvoted");
      } else {
        toast.error("Error upvoting comment");
      }
    } catch (error) {
      console.error("Error upvoting comment:", error.message);
      toast.error("Error upvoting comment");
    }
  }
  
  async function downvoteComment(e, comment) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const userObj = {
        id: user.id, 
        username: user.username,
        avtar: user.avtar,
      };
      if (comment.downvotes.some((obj) => obj.username === user.username)) {
        return;
      }
      e.target.lastElementChild.innerHTML = comment.downvotes.length + 1;
      comment.downvotes.push(userObj);
      if (comment.upvotes.some((obj) => obj.username === user.username)) {
        e.target.previousSibling.lastElementChild.innerHTML = comment.upvotes.length - 1;
        comment.upvotes = comment.upvotes.filter((obj) => obj.username !== user.username);
      }
      const response = await fetch("http://localhost:4000/api/comment/downvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: comment._id, userObj }),
      });
      if (response.ok) {
        toast.success("Comment downvoted");
      } else {
        toast.error("Error downvoting comment");
      }
    } catch (error) {
      console.error("Error downvoting comment:", error.message);
      toast.error("Error downvoting comment");
    }
  }

  


  useEffect(() => {
    fetchPost();
    fetchComments();

  }, []);

  const calculateTimeAgo = (createdAt) => {
    const currentTime = new Date();
    const postTime = new Date(createdAt);
    const timeDifference = currentTime - postTime;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference > 0) {
      return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
    } else if (hoursDifference > 0) {
      return `${hoursDifference} hour${hoursDifference > 1 ? "s" : ""} ago`;
    } else {
      return `${minutesDifference} minute${
        minutesDifference > 1 ? "s" : ""
      } ago`;
    }
  };

  return (
    <div className="mt-[15vh] mb-[10vh]">
      <div
        key={id}
        className="w-[90%] md:w-[60%] mx-auto border border-gray-300 p-4 rounded-lg shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]" // shadow-[rgba(0,_0,_0,_0.2)_0px_10px_10px]
        style={{ zIndex: -99 }}
      >
        <p
          onClick={() =>
            navigate(`/viewprofile?username=${post?.author?.username}`)
          }
          className="flex items-center gap-2 text-black text-md font-bold mb-2 border-b border-gray-200 p-2"
        >
          {(
            <img
              src={
                post?.author?.avtar?.length > 15
                  ? post?.author?.avtar
                  : iconSrcList[post?.author?.avtar]
              }
              className="hoverZoomLink w-8 h-8 rounded-full object-cover mx-3"
            />
          ) || <FaUser className="border border-black p-1 rounded-full" />}
          {post?.author?.username}
          <span className="text-sm ml-2 text-gray-500">
            {calculateTimeAgo(post?.createdAt)}
          </span>
        </p>
        <h1 className="text-xl mb-2">
          <p
            style={{ width: "95%", margin: "0 auto" }}
            className="font-bold text-md"
          >
            {" "}
            {post?.title || "Awesome Title"}
          </p>
        </h1>
        <h1 className="text-xl">
          <span className="font-semibold"> </span>
          <p
            style={{ width: "95%", margin: "10px auto", marginTop: 0 }}
            className="bg-light-off-white border border-gray-200 p-4 text-sm"
          >
            {post?.content || "this is a description."}
          </p>
        </h1>
        <div className="w-[40%] md:w-[30%] relative z-0 flex items-center justify-between mt-4 mx-[1.5vw]">
          <div className="w-[80%] md:w-[50%] flex justify-between items-center bg-black p-2 rounded-md -z-50">
            <div
              className="flex items-center gap-1 cursor-pointer z-99"
              onClick={(e) => Upvote(e, post)}
            >
              <FaRegArrowAltCircleUp
                style={{ zIndex: -1 }}
                className="text-white text-xl "
              />{" "}
              <span style={{ zIndex: -1 }} className="font-bold text-white">
                {post?.upvotes?.length}
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
              <span
                style={{ zIndex: -1 }}
                className="font-bold -z-1 text-white"
              >
                {post?.downvotes?.length}
              </span>
            </div>
          </div>
        </div>
        <form
          onSubmit={(e) => handleCommentSubmit(e, id)}
          className="w-[95%] mt-4 mx-auto"
        >
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
      </div>
      <div className="w-[90%] md:w-[60%] mx-auto border border-gray-300 p-4 rounded-lg shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
        <span className="text-black font-bold font-8xl">{comments?.length}{" "}Comments</span>
        {comments?.map(createCommentsDiv)}
      </div>
    </div>
  );
};
