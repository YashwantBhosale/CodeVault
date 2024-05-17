import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaFontAwesome,
  FaRegArrowAltCircleDown,
  FaRegArrowAltCircleUp,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { iconSrcList } from "../utils/icons";

export const ViewPost = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);

    async function fetchPost() {
        try {
            const response = await fetch(`http://localhost:4000/api/public/post?id=${id}`);
            const data = await response.json();
            setPost(data);
        } catch (error) {
            console.log(error.message);
            toast.error("Failed to fetch post");
        }
    }

    async function  fetchComments() {}

    async function handleCommentSubmit() {}

    function createCommentsDiv() {}

    useEffect(() => {
        fetchPost();
    }, []);

    return (
        <div className="my-20">
          <div className="bg-white shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] md:w-[75%] mx-auto border border-gray-300 p-4 my-20 rounded-lg">
            <p className="flex items-center gap-2 text-black text-xl font-bold mb-2 border-b border-gray-200 p-4">
              {/* <FaUser className="border border-black p-1 rounded-full" />
               */}
              <img
                src={iconSrcList[post ? post?.author?.avtar : "panda"]}
                className="hoverZoomLink w-8 h-8 rounded-full object-cover mx-3"
              />
              {post?.author.username || "user"}
            </p>
            <h1 className="text-xl mb-2">
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
                {post.content || "this is a description."}
              </p>
            </h1>
            <div className="flex items-center justify-evenly">
              <div className="flex items-center gap-4 my-2">
                <FaRegArrowAltCircleUp className="text-green-500 text-xl" />{" "}
                <span className="font-bold">{post?.upvotes?.length}</span>
              </div>
              <div className="flex items-center gap-4">
                <FaRegArrowAltCircleDown className="text-red-500 text-xl" />{" "}
                <span className="font-bold">{post?.downvotes?.length}</span>
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
            <div className="flex flex-col mt-10">
              {comments && createCommentsDiv(comments)}
            </div>
          </div>
        </div>
      );
}