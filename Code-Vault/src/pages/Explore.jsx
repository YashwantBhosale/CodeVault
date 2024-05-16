import React, { useEffect, useState, useRef } from "react";
import { SyncLoader } from "react-spinners";
import { motion } from "framer-motion";
import {
  FaFontAwesome,
  FaRegArrowAltCircleDown,
  FaRegArrowAltCircleUp,
  FaUser,
} from "react-icons/fa";
import generateUniqueId from "generate-unique-id";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { auth, db } from "../utils/firebase";
import {
  Timestamp,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import iconsList, { iconSrcList } from "../utils/icons";
console.log(iconsList);

export const Explore = (props) => {
  const navigate = useNavigate();
  const [lastId, setLastId] = useState("");
  const [docref, setdocref] = useState(null);
  const [posts, setposts] = useState([]);
  const [postsloading, setpostsloading] = useState(false);
  const [allpostsfetched, setallpostsfetched] = useState(false);
  const [newpostloading, setnewepostloading] = useState(false);

  const postref = collection(db, "posts");
  const postquery = query(postref, limit(3), orderBy("dateCreated", "desc"));

  // firebase hooks
  // const [user, loading, error] = useAuthState(auth);
  const user = auth.currentUser;
  const loading = props.userLoading;
  // const [value, dataloading, dataerror] = useDocument(docref);
  const [value, setValue] = useState(null);
  // const [snapshot, collectionloading, collectionerror] = useCollection(
  //   collection(db, "users")
  // );
  const [snapshot, setSnapshot] = useState(null);
  const [collectionloading, setcollectionloading] = useState(false);

  async function mountFunction() {
    if (user && !loading) {
      setdocref(doc(db, "users", user.uid));
      setValue(await getDoc(doc(db, "users", user.uid)));
    }
    try {
      const usersquery = query(collection(db, "users"), limit(8));
      setcollectionloading(true);
      setSnapshot(await getDocs(usersquery));
      setcollectionloading(false);
    } catch (e) {
      console.error("Error fetching users : ", e.message);
    }

    setpostsloading(true);
    let docs = await getDocs(postquery);
    let fetchedposts = [];
    docs.docs.forEach((post) => {
      fetchedposts.push(post.data());
    });
    setposts(fetchedposts);
    setpostsloading(false);
    setLastId(fetchedposts[fetchedposts.length - 1].dateCreated);
  }

  useEffect(() => {
    mountFunction();
  }, [user]);

  async function fetchNextBatch(e) {
    try {
      setnewepostloading(true);
      const nextpostquery = query(
        postref,
        limit(3),
        orderBy("dateCreated", "desc"),
        startAfter(lastId)
      );
      const docs = await getDocs(nextpostquery);
      console.log("docs : ", docs.docs);
      if (docs.docs.length) {
        let newposts = [];
        docs.docs.forEach((doc) => {
          newposts.push(doc.data());
        });
        setLastId(newposts[newposts.length - 1].dateCreated);
        setposts(posts.concat(newposts));
      } else {
        setallpostsfetched(true);
      }
      setnewepostloading(false);
    } catch (error) {
      setnewepostloading(false);
      setallpostsfetched(true);
      console.error("Error fetching new posts : ", error.message);
    }
  }
  async function handleFollow(e, id, username) {
    let obj = {
      id,
      username,
    };
    if (e.target.innerHTML === "follow") {
      e.target.innerHTML = "processing...";
      await updateDoc(doc(db, "users", user.uid), {
        following: arrayUnion(obj),
      });
      await updateDoc(doc(db, "users", id), {
        followers: arrayUnion({ id: user.uid, username: user.displayName }),
        notifications: arrayUnion({
          data: `${user.displayName} started following you!`,
          timestamp: Timestamp.fromDate(new Date()),
          priority: "A",
          type: "follow",
          isSeen: false,
        }),
      });
      e.target.innerHTML = "unfollow";
    } else {
      e.target.innerHTML = "processing...";
      await updateDoc(doc(db, "users", user.uid), {
        following: arrayRemove(obj),
      });
      await updateDoc(doc(db, "users", id), {
        followers: arrayRemove({ id: user.uid, username: user.displayName }),
      });
      e.target.innerHTML = "follow";
    }
  }

  async function handleCommentSubmit(e, id) {
    e.preventDefault();
    const ref = doc(db, "posts", id);
    const commentsref = collection(ref, "comments");
    const date = new Date();
    let commentsid = generateUniqueId();
    let comment = {
      comment: e.target.comment.value,
      timestamp: Timestamp.fromDate(date),
      parentid: id,
      id: commentsid,
      author: user.displayName,
    };
    try {
      await addDoc(commentsref, comment);
      toast.success("comment added successfully!");
    } catch (error) {
      console.log("error adding comment ! ", error.message);
      toast.error("Error adding comment!");
    }
  }

  function createPostsDiv(post, id) {
    return (
      <div
        // onClick={(e) => {e.preventDefault(); e.stopPropagation(); navigate(`/viewpost?id=${id}`)}}
        key={id}
        className="w-[90%] mx-auto border border-gray-300 p-4 my-4 rounded-lg shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]" // shadow-[rgba(0,_0,_0,_0.2)_0px_10px_10px]
        style={{zIndex: -99}}
      >
        <p className="flex items-center gap-2 text-black text-xl font-bold mb-2 border-b border-gray-200 p-4">
          {(
            <img
              src={iconSrcList[post.avtar]}
              className="hoverZoomLink w-8 h-8 rounded-full object-cover mx-3"
            />
          ) || <FaUser className="border border-black p-1 rounded-full" />}
          {post.author}
        </p>
        <h1 className="text-xl my-7">
          <p style={{width: "95%", margin: "10px auto"}} className="font-semibold">
            {" "}
            {post.title || "Awesome Title"}
          </p>
        </h1>
        <h1 className="text-xl">
          <span className="font-semibold"> </span>
          <p style={{width: "95%", margin: "10px auto", marginTop: 0}} className="bg-light-off-white border border-gray-200 p-4">{post.description || "this is a description."}</p>
        </h1>
        <div className="flex items-center justify-evenly">
          <div
            className="flex items-center gap-4 cursor-pointer z-99 my-2"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const ref = doc(db, "posts", id);
              try {
                if (post.upvotes.includes(user.displayName)) {
                  console.log("already upvoted");
                  return;
                }
                e.target.lastElementChild.innerHTML = post.upvotes.length + 1;
                post.upvotes.push(user.displayName);
                await updateDoc(ref, {
                  upvotes: arrayUnion(user.displayName),
                });
                if (post.downvotes.includes(user.displayName)) {
                  e.target.nextSibling.lastElementChild.innerHTML =
                    post.downvotes.length - 1;
                  post.downvotes = post.downvotes.filter(
                    (name) => name !== user.displayName
                  );
                  // setposts([...posts, post]);
                  await updateDoc(ref, {
                    downvotes: arrayRemove(user.displayName),
                  });
                }
                toast.success("added to upvoted posts");
              } catch (error) {
                console.log("error upvoting post : ", error.message);
              }
            }}
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
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const ref = doc(db, "posts", id);
              try {
                if (post.downvotes.includes(user.displayName)) {
                  console.log("already downvoted");
                  return;
                }
                e.target.lastElementChild.innerHTML = post.downvotes.length + 1;
                post.downvotes.push(user.displayName);
                // setposts([...posts, post]);
                await updateDoc(ref, {
                  downvotes: arrayUnion(user.displayName),
                });
                if (post.upvotes.includes(user.displayName)) {
                  e.target.previousSibling.lastElementChild.innerHTML =
                    post.upvotes.length - 1;
                  post.upvotes = post.upvotes.filter(
                    (name) => name !== user.displayName
                  );
                  setposts([...posts, post]);
                  await updateDoc(ref, {
                    upvotes: arrayRemove(user.displayName),
                  });
                }
                toast.success("added to downvoted posts");
              } catch (error) {
                console.log("error downvoting post : ", error.message);
              }
            }}
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
          onClick={() => navigate(`/viewpost?id=${id}&avtar=${post.avtar}`)}
        >
          Comments
        </button>
      </div>
    );
  }

  function createInfoDiv(data, id) {
    return (
      <div
        className="w-3/4 md:w-1/3 mx-auto flex justify-between items-center border-b border-gray-300 p-2"
        key={id}
      >
        <div className="flex">
          {/* <FaUser
            style={{
              border: "1px solid black",
              padding: 4,
              borderRadius: "50%",
              boxSizing: "content-box",
              marginRight: "1vw",
            }}
          /> */}
          <img
            src={
              iconSrcList[data?.avtar] ||
              "https://avataaars.io/?accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&facialHairColor=Platinum&clotheType=ShirtScoopNeck&clotheColor=White&eyeType=Happy&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Light"
            }
            className="hoverZoomLink w-8 h-8 rounded-full object-cover mx-3"
          />
          <h1>{data.username}</h1>
        </div>
        <button
          className="bg-black text-white border border-gray-300 px-3 py-1 rounded-md hover:bg-slate-700"
          onClick={(e) => handleFollow(e, id, data.username)}
        >
          {value.data().following.some((obj) => obj.id === id)
            ? "unfollow"
            : "follow"}
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mt-20"
    >
      <div className="text-center text-2xl font-bold">Explore Other Users</div>
      {collectionloading ? (
        <div className="flex justify-center items-center mt-5">
          <SyncLoader />
        </div>
      ) : (
        <div className="mt-5">
          {snapshot
            ? snapshot.docs.map((doc) =>
                doc.data().username === user.displayName
                  ? null
                  : createInfoDiv(doc.data(), doc.id)
              )
            : null}
        </div>
      )}
      {postsloading ? (
        <div className="flex justify-center items-center mt-5">
          <SyncLoader />
        </div>
      ) : (
        <div className="mt-5">
          {posts.map((doc) => {
            return createPostsDiv(doc, doc.id);
          })}
          {newpostloading ? (
            <p className="text-center my-4">Loading....</p>
          ) : !allpostsfetched ? (
            <div className="flex justify-center items-center">
              <button
                onClick={fetchNextBatch}
                className="px-4 py-2 bg-gray-800 text-white rounded-md mb-20"
              >
                Load more
              </button>
            </div>
          ) : (
            <p className="text-center my-4 mb-20">You have all caught up</p>
          )}
        </div>
      )}
    </motion.div>
  );
};
