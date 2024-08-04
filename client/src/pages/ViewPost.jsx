import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import {
  FaFontAwesome,
  FaRegArrowAltCircleDown,
  FaRegArrowAltCircleUp,
  FaUser,
  FaRegComment,
  FaStar,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { iconSrcList } from "../utils/icons";
import ImageViewer from "react-simple-image-viewer";

export const ViewPost = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const user = useAuthContext().user;
  const navigate = useNavigate();
  const [postUpvotes, setPostUpvotes] = useState(0);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [currentSrcSet, setCurrentSrcSet] = useState([]);
  const [srcSet, setSrcSet] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { dispatch } = useAuthContext();

  async function fetchPost() {
    try {
      const response = await fetch(BASE_URL + `api/public/post?id=${id}`);
      const data = await response.json();
      console.log(data);
      setPost(data);
      if (data.files) {
        let filesrc = data.files.map(
          (file) =>
            `${BASE_URL}api/public/files?filename=${encodeURIComponent(file)}`
        );
        setSrcSet([...filesrc]);
      }
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
        user_id: user.id,
        username: user.username,
        avtar: user.avtar,
      };
      if (post.upvotes.some((obj) => obj.username == user.username)) {
        return;
      }
      let updatedPost = { ...post };
      if (post.downvotes.some((obj) => obj.username == user.username)) {
        let updatedDownvotes = post.downvotes.filter(
          (obj) => obj.username !== user.username
        );
        updatedPost = { ...updatedPost, downvotes: updatedDownvotes };
      }

      updatedPost = {
        ...updatedPost,
        upvotes: [...updatedPost.upvotes, userObj],
      };
      setPost(updatedPost);
      let _public_posts = JSON.parse(sessionStorage.getItem("public_posts"));
      let _updated = _public_posts.map((p) =>
        p._id === updatedPost._id ? updatedPost : p
      );
      dispatch({ action: "UPDATE_POSTS", payload: _updated });
      sessionStorage.setItem("public_posts", JSON.stringify(_updated));

      let _posts = JSON.parse(sessionStorage.getItem("posts"));
      let _updated_posts = _posts.map((p) =>
        p._id === updatedPost._id ? updatedPost : p
      );
      sessionStorage.setItem("posts", JSON.stringify(_updated_posts));

      let response = await fetch(BASE_URL + "api/public/updateupvotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: post._id, userObj }),
      });
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
        user_id: user.id,
        username: user.username,
        avtar: user.avtar,
      };

      if (post.downvotes.some((obj) => obj.username == user.username)) {
        return;
      }
      let updatedPost = { ...post };
      if (post.upvotes.some((obj) => obj.username == user.username)) {
        let updatedUpvotes = post.upvotes.filter(
          (obj) => obj.username !== user.username
        );
        updatedPost = { ...updatedPost, upvotes: updatedUpvotes };
      }
      updatedPost = {
        ...updatedPost,
        downvotes: [...updatedPost.downvotes, userObj],
      };
      setPost(updatedPost);
      let _public_posts = JSON.parse(sessionStorage.getItem("public_posts"));
      let _updated = _public_posts.map((p) =>
        p._id === updatedPost._id ? updatedPost : p
      );
      dispatch({ action: "UPDATE_POSTS", payload: _updated });
      sessionStorage.setItem("public_posts", JSON.stringify(_updated));

      let _posts = JSON.parse(sessionStorage.getItem("posts"));
      let _updated_posts = _posts.map((p) =>
        p._id === updatedPost._id ? updatedPost : p
      );
      sessionStorage.setItem("posts", JSON.stringify(_updated_posts));

      let response = await fetch(BASE_URL + "api/public/updatedownvotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: post._id, userObj }),
      });

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
        BASE_URL + `api/comment/getcomments?postId=${id}`
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
      const response = await fetch(BASE_URL + "api/comment/addcomment", {
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
      });
      if (response.ok) {
        toast.success("Comment posted successfully");
        fetchComments();
      } else {
        toast.error("Failed to post comment");
      }
      e.target.reset();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    }
  }

  function createCommentsDiv(comment) {
    return (
      <div
        key={comment._id}
        className="mx-auto border border-gray-300 my-4 rounded-lg" // shadow-[rgba(0,_0,_0,_0.2)_0px_10px_10px] newer:shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]
        style={{ zIndex: -99 }}
      >
        <p
          onClick={() =>
            navigate(`/viewprofile?username=${comment.author.username}`)
          }
          className="flex items-center gap-2 text-black text-md font-bold p-2"
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
          <div className="flex flex-col justify-start">
            <span>{comment.author.username}</span>
            <span className="text-xs font-light text-gray-500">
              {calculateTimeAgo(comment.timestamp)}
            </span>
          </div>
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
          <div className="w-full md:w-[70%] flex justify-start gap-[15px] items-center p-2 rounded-md -z-50 text-black">
            <div
              className="flex items-center gap-[10px] cursor-pointer z-99 justify-center"
              onClick={(e) => upvoteComment(e, comment)}
            >
              {comment?.upvotes?.some(
                (upvote) =>
                  upvote.username === user.username || upvote.id === user.id
              ) ? (
                <svg
                  fill="#000000"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  height="25px"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"></path>
                  </g>
                </svg>
              ) : (
                <svg
                  fill="#000000"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  height="25px"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z"></path>
                  </g>
                </svg>
              )}
              {/* <FaRegArrowAltCircleUp
                style={{ zIndex: -1 }}
                className="text-xl "
              />
               */}{" "}
              <span style={{ zIndex: -1 }} className="font-bold">
                {comment.upvotes.length}
              </span>
            </div>
            <div
              className="flex items-center z-99 gap-[10px] cursor-pointer justify-center"
              onClick={(e) => downvoteComment(e, comment)}
            >
              {/* <FaRegArrowAltCircleDown
                style={{ zIndex: -1 }}
                className="text-xl -z-1"
              /> */}
              {comment?.downvotes?.some(
                (downvote) =>
                  downvote.username === user.username || downvote.id === user.id
              ) ? (
                <svg
                  fill="#000000"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  height="25px"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059z"></path>
                  </g>
                </svg>
              ) : (
                <svg
                  fill="#000000"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  height="25px"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0" height="25px"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059zM12 19.399 6.081 12H10V4h4v8h3.919L12 19.399z"></path>
                  </g>
                </svg>
              )}{" "}
              <span style={{ zIndex: -1 }} className="font-bold -z-1">
                {comment.downvotes.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  async function upvoteComment(e, comment) {
    console.log(comment);
    e.preventDefault();
    e.stopPropagation();
    try {
      const userObj = {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      };

      if (comment.upvotes.some((obj) => obj.username === user.username)) {
        return;
      }

      let updatedComments = [...comments];

      if (comment.downvotes.some((obj) => obj.username === user.username)) {
        const updatedDownvotes = comment.downvotes.filter(
          (obj) => obj.username !== user.username
        );

        updatedComments = updatedComments.map((c) =>
          c._id === comment._id ? { ...c, downvotes: updatedDownvotes } : c
        );
      }
      updatedComments = updatedComments.map((c) =>
        c._id === comment._id ? { ...c, upvotes: [...c.upvotes, userObj] } : c
      );
      setComments(updatedComments);

      const response = await fetch(BASE_URL + "api/comment/upvote", {
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
        avatar: user.avatar,
      };

      if (comment.downvotes.some((obj) => obj.username === user.username)) {
        return;
      }

      let updatedComments = [...comments];

      updatedComments = updatedComments.map((c) =>
        c._id === comment._id
          ? { ...c, downvotes: [...c.downvotes, userObj] }
          : c
      );

      if (comment.upvotes.some((obj) => obj.username === user.username)) {
        const updatedUpvotes = comment.upvotes.filter(
          (obj) => obj.username !== user.username
        );

        updatedComments = updatedComments.map((c) =>
          c._id === comment._id ? { ...c, upvotes: updatedUpvotes } : c
        );
      }
      setComments(updatedComments);

      const response = await fetch(BASE_URL + "api/comment/downvote", {
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
          className="flex items-center gap-2 text-black text-md font-bold mb-2 border-b border-gray-200 py-2"
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
          <div className="flex flex-col justify-start">
            <span>{post?.author?.username}</span>
            {!post?.isPublic && <FaStar title="This is a private post." />}
            <span className="text-xs font-light text-gray-500">
              {calculateTimeAgo(post.createdAt)}
            </span>
          </div>
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
            dangerouslySetInnerHTML={{ __html: post.content }}
          >
            {/* {post?.content || "this is a description."} */}
          </p>
        </h1>
        {isViewerOpen && (
          <div style={{ position: "absolute", zIndex: 999999 }}>
            <ImageViewer
              src={srcSet}
              currentIndex={currentIndex}
              onClose={() => setIsViewerOpen(false)}
            />
          </div>
        )}
        <div className="w-[95%] mx-auto flex flex-wrap">
          {post?.files?.length
            ? post.files.map((file, index) => {
                return (
                  <img
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsViewerOpen(true);
                    }}
                    src={`${BASE_URL}api/public/files?filename=${encodeURIComponent(
                      file
                    )}`}
                    alt="post"
                    className="my-2 mx-2 object-cover rounded-lg h-[200px] w-[200px] cursor-pointer shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                  />
                );
              })
            : null}
        </div>
        <div className="w-[40%] md:w-[30%] relative z-0 flex items-center justify-between mt-4 mx-[1.5vw]">
          <div className="w-[80%] md:w-[50%] flex justify-start gap-[15px] items-center p-2 rounded-md -z-50">
            <div
              className="flex items-center gap-1 cursor-pointer z-99 w-[70px] justify-center"
              onClick={(e) => Upvote(e, post)}
            >
              {post?.upvotes?.some(
                (upvote) =>
                  upvote.username === user.username || upvote.id === user.id
              ) ? (
                <svg
                  fill="#000000"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  height="25px"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"></path>
                  </g>
                </svg>
              ) : (
                <svg
                  fill="#000000"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  height="25px"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z"></path>
                  </g>
                </svg>
              )}{" "}
              <span
                style={{
                  zIndex: -1,
                  fontSize: "20px",
                  verticalAlign: "center",
                }}
                className=" text-black"
              >
                {post?.upvotes?.length}
              </span>
            </div>
            <div
              className="flex items-center z-99 gap-1 cursor-pointer w-[70px] justify-center"
              onClick={(e) => Downvote(e, post)}
            >
              {post?.downvotes?.some(
                (downvote) =>
                  downvote.username === user.username || downvote.id === user.id
              ) ? (
                <svg
                  fill="#000000"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  height="25px"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059z"></path>
                  </g>
                </svg>
              ) : (
                <svg
                  fill="#000000"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  height="25px"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0" height="25px"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059zM12 19.399 6.081 12H10V4h4v8h3.919L12 19.399z"></path>
                  </g>
                </svg>
              )}{" "}
              <span
                style={{ zIndex: -1, fontSize: "20px" }}
                className=" -z-1 text-black"
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
              className="border border-gray-300 rounded-md p-2 mt-2 mr-[10px] w-full"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-md mt-2 hover:bg-slate-700"
            >
              POST
            </button>
          </div>
        </form>
        <div className="w-[95%] mx-auto rounded-lg  mt-[15px]">
          {" "}
          {/* md:w-[60%] border border-gray-300 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] */}
          <span className="text-black font-bold font-8xl">
            {comments && comments?.length} Comments
          </span>
          {comments && comments?.map(createCommentsDiv)}
        </div>
      </div>
    </div>
  );
};
