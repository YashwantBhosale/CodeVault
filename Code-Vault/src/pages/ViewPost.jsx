import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaFontAwesome,
  FaRegArrowAltCircleDown,
  FaRegArrowAltCircleUp,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import generateUniqueId from "generate-unique-id";

import { auth, db } from "../utils/firebase";
import { collection, doc, addDoc, getDoc, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { iconSrcList } from "../utils/icons";

export const ViewPost = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);

  async function fetchComments(postref) {
    try {
      const commentsref = collection(postref, "comments");
      const commentsDocs = await getDocs(commentsref);
      const comments = [];
      commentsDocs.forEach((comment) => {
        comments.push(comment.data());
      });
      setComments(comments);
      return comments;
    } catch (e) {
      console.log("Error fetching comments!!", e.message);
      return;
    }
  }

  async function fetchPost() {
    try {
      const ref = doc(db, "posts", id);
      const fetchedpost = await getDoc(ref);
      setPost(fetchedpost.data());
      const comments = await fetchComments(ref);
    } catch (e) {
      console.log("Error fetching post!!", e.message);
    }
  }

  async function handleCommentSubmit(e, id) {
    e.preventDefault();
    const ref = doc(db, "posts", id);
    const commentsref = collection(ref, "comments");
    const date = new Date();
    let comment = {
      author: auth.currentUser.displayName,
      comment: e.target.comment.value,
      timestamp: Timestamp.fromDate(date),
      parentid: id,
      id: generateUniqueId(),
    };
    try {
      await addDoc(commentsref, comment);
      setComments([...comments, comment]);
      toast.success("comment added successfully!");
    } catch (error) {
      console.log("error adding comment ! ", error.message);
      toast.error("Error adding comment!");
    }
  }

  function createCommentsDiv(comments) {
    return comments.map((comment) => {
      return (
        <div
          key={comment.id}
          className="w-full mx-auto border border-gray-300 p-4 my-1 rounded-lg" //shadow-md
        >
          <p className="flex items-center gap-2 text-black text-xl font-semibold mb-2">
            <FaUser className="border border-black p-1 rounded-full" />
            {comment.author}
          </p>
          <p>{comment.comment}</p>
        </div>
      );
    });
  }

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
            src={iconSrcList[post.avtar]}
            className="hoverZoomLink w-8 h-8 rounded-full object-cover mx-3"
          />
          {post.author}
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
            {post.description || "this is a description."}
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
};
