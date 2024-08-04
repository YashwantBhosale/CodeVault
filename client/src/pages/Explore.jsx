import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import {
  FaUser,
  FaRegArrowAltCircleUp,
  FaRegArrowAltCircleDown,
  FaComment,
  FaArrowDown,
  FaStar,
  FaThumbtack,
} from "react-icons/fa";
import { faChevronDown, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { iconSrcList } from "../utils/icons";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "../components/Autocomplete";
import ImageViewer from "react-simple-image-viewer";
import { useFetchPosts } from "../hooks/useFetchPosts";
import { useFetchUsers } from "../hooks/useFetchUsers";
import InfiniteScroll from "react-infinite-scroll-component";
import { SyncLoader } from "react-spinners";
import DeleteConfirmation from "../components/DeleteConfirmation";
export const Explore = () => {
  const [page, setPage] = useState(2);
  const {
    postsLoading,
    fetchPublicPosts,
    fetchMostFavouritedSnippets,
    fetchPublicPostsBatch,
  } = useFetchPosts();
  const { fetchPublicUsers, publicUsersLoading, mostfollowed } =
    useFetchUsers();
  const { user, dispatch, posts, fetched, mostFavouritedSnippets } =
    useAuthContext();
  const navigate = useNavigate();
  const [allstudents, setAllStudents] = useState([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentSrcSet, setCurrentSrcSet] = useState([]);
  const srcSet = [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletePostId, setDeletePostId] = useState("");
  const [followingFeed, setFollowingFeed] = useState([]);
  const [followingFeedOpen, setFollowingFeedOpen] = useState(false);
  const [activeFeed, setActiveFeed] = useState("trending");
  const [feedPosts, setFeedPosts] = useState([]);
  const [popularSnippetsOpen, setPopularSnippetsOpen] = useState(false);

  useEffect(() => {
    if (activeFeed == "following") {
      setFollowingFeedOpen(true);
      if (posts) {
        let followfeed = posts.filter((post) => {
          return user.following.some(
            (followingUser) => followingUser.username === post.author.username
          );
        });
        setFollowingFeed(followfeed);
      }
    } else {
      setFollowingFeedOpen(false);
    }

    if (posts) {
      if (activeFeed === "all") {
        setFeedPosts(posts);
        return;
      } else {
        let feedposts = posts.filter((post) => post.tags.includes(activeFeed));
        setFeedPosts(feedposts);
      }
    }
  }, [posts, activeFeed]);

  const tags = [
    "all",
    "trending",
    "new",
    "popular",
    "top",
    "non-tech",
    "following",
  ];
  async function fetchAllUsers() {
    try {
      const response = await fetch(BASE_URL + "api/public/getallusers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setAllStudents(data);
    } catch (error) {
      console.error(error);
    }
  }

  function truncateDescription(description, maxLength) {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + "...";
    }
    return description;
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
      // e.target.lastElementChild.innerHTML = post.upvotes.length + 1;
      let updatedPost = { ...post };
      if (post.downvotes.some((obj) => obj.username == user.username)) {
        // e.target.nextSibling.lastElementChild.innerHTML =
        // post.downvotes.length - 1;
        let updatedDownvotes = post.downvotes.filter(
          (obj) => obj.username !== user.username
        );

        updatedPost = { ...updatedPost, downvotes: updatedDownvotes };
      }
      updatedPost = {
        ...updatedPost,
        upvotes: [...updatedPost.upvotes, userObj],
      };
      let updatedFeedPosts = feedPosts.map((p) =>
        p._id === updatedPost._id ? updatedPost : p
      );
      setFeedPosts(updatedFeedPosts);

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
      let updatedFeedPosts = feedPosts.map((p) =>
        p._id === updatedPost._id ? updatedPost : p
      );
      setFeedPosts(updatedFeedPosts);

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

  useEffect(() => {
    fetchAllUsers();
    // fetchMostFollowed();
    fetchPublicUsers();
    fetchMostFavouritedSnippets();
    console.log(mostFavouritedSnippets);
    if (!fetched) {
      fetchPublicPosts();
    }

    if (posts) {
      let followfeed = posts.filter((post) => {
        return user.following.some(
          (followingUser) => followingUser.username === post.author.username
        );
      });
      setFollowingFeed(followfeed);
      console.log(followingFeed);
    }
  }, []);

  function localFollow(e, userObj) {
    if (userObj.username == user.uername) {
      toast.info("You cannot follow Yourself!");
      return;
    }
    switch (e.target.innerText) {
      case "Follow": {
        user.following.push(userObj);
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: "UPDATE", payload: user });
        return;
      }
      case "Unfollow": {
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
    if (userobj.username == user.uername) {
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
      case "Unfollow": {
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

  async function handleDelete(id) {
    setDeletePostId(id);
    setShowDeleteConfirmation(true);
  }

  async function handleDeletePost() {
    try {
      const id = deletePostId;
      const response = await fetch(BASE_URL + "api/public/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        toast.success("Post deleted successfully!");
        sessionStorage.setItem(
          "posts",
          JSON.stringify(posts.filter((post) => post._id !== id))
        );
        dispatch({ type: "DELETE_POST", payload: id });
      } else {
        toast.error("Error deleting post!");
      }

      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error(error.message);
      toast.error("Error deleting post!");
    }
  }
  function scrollLeft(container) {
    container.scrollBy({ left: -250, behavior: "smooth" });
  }

  function scrollRight(container) {
    container.scrollBy({ left: 250, behavior: "smooth" });
  }

  function createMostFollowedUsersDiv(userobj) {
    if (userobj.username === user.username) {
      return;
    }
    return (
      <div
        class="w-[18vw] min-w-[250px] s:min-w-[200px] my-2 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center h-full s:max-h-[250px]"
        onClick={() => {
          userobj.username === user.username
            ? navigate("/profile")
            : navigate(`/viewprofile?username=${userobj?.username}`);
        }}
      >
        <div className="h-full">
          <img
            class="object-center object-cover rounded-full h-36 w-36 s:w-[100px] s:h-[100px]"
            src={
              userobj?.avtar.length > 15
                ? userobj.avtar
                : iconSrcList[userobj?.avtar || "user"]
            }
            alt="photo"
          />
        </div>
        <div class="text-center mt-4">
          <p class="text-xl whitespace-nowrap text-black font-bold mb-2">
            {userobj.username}
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFollowButton(e, userobj);
            }}
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

  function getMonthFromIndex(index) {
    switch (index) {
      case 0:
        return "Jan";
      case 1:
        return "Feb";
      case 2:
        return "Mar";
      case 3:
        return "Apr";
      case 4:
        return "May";
      case 5:
        return "Jun";
      case 6:
        return "Jul";
      case 7:
        return "Aug";
      case 8:
        return "Sep";
      case 9:
        return "Oct";
      case 10:
        return "Nov";
      case 11:
        return "Dec";
      default:
        return "Invalid month index";
    }
  }

  function displaySnippets(snippet, isPinned = false) {
    const month = getMonthFromIndex(
      Number.parseInt(snippet.dateCreated.split("-")[1]) - 1
    );
    const day = snippet.dateCreated.split("-")[2].split("T")[0];
    const date = `${month} ${day}`;

    console.log(user.username, snippet.author);

    return (
      <article
        key={snippet._id}
        className="flex bg-white transition hover:shadow-xl w-[29%] border-2 rounded-xl m-[20px] min-w-[340px]"
      >
        {isPinned && (
          <FontAwesomeIcon
            icon={faThumbtack}
            className="text-yellow-500 text-xl ml-2 mt-2"
          />
        )}
        <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
          <time
            // dateTime={date}
            className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
          >
            <span>{date}</span>
            <span className="w-px flex-1 bg-gray-900/10"></span>
            <span>
              {/* {getMonthAndDayFromSeconds(snippet.dateCreated.seconds)} */}
            </span>
          </time>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6 min-h-[150px]">
            <a href="#">
              <h3 className="font-bold uppercase text-gray-900">
                {snippet.title}
              </h3>
            </a>
            <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
              <span className="font-bold text-gray-900">Description:</span>{" "}
              {truncateDescription(snippet.description || "N/A", 17)}
            </p>
            <p>
              <span className="font-bold text-gray-900">Language:</span>{" "}
              {snippet.language}
            </p>
          </div>
          <div className="flex items-end justify-end">
            <button
              onClick={() => {
                if (snippet.author == user.id) {
                  navigate(`/snippets?id=${snippet._id}`);
                } else {
                  navigate(`/viewpublicsnippet?snippetId=${snippet._id}`);
                }
              }}
              className="block bg-black px-5 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-slate-600 rounded-br-xl"
            >
              Open
            </button>
          </div>
        </div>
      </article>
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
      return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
    } else if (hoursDifference > 0) {
      return `${hoursDifference} hour${hoursDifference > 1 ? "s" : ""} ago`;
    } else {
      return `${minutesDifference} minute${
        minutesDifference > 1 ? "s" : ""
      } ago`;
    }
  };
  function createPostsDiv(post, id) {
    if (post.files) {
      let filesrc = post.files.map(
        (file) =>
          `${BASE_URL}api/public/files?filename=${encodeURIComponent(file)}`
      );
      srcSet.push(filesrc);
    }
    return (
      <div
        key={id}
        className="w-[90%] md:w-[60%] mx-auto border border-gray-300 p-4 my-4 rounded-lg shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]" // shadow-[rgba(0,_0,_0,_0.2)_0px_10px_10px]
        style={{ zIndex: -99 }}
      >
        {isViewerOpen && (
          <div style={{ position: "absolute", zIndex: 999999 }}>
            <ImageViewer
              src={currentSrcSet}
              currentIndex={currentIndex}
              onClose={() => setIsViewerOpen(false)}
            />
          </div>
        )}
        <p
          onClick={() => {
            post.author.username === user.username
              ? navigate("/profile")
              : navigate(`/viewprofile?username=${post.author.username}`);
          }}
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
          <div className="flex flex-col justify-start">
            <span>{post.author.username}</span>
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
            {post.title || "Awesome Title"}
          </p>
        </h1>
        <h1 className="text-xl">
          <span className="font-semibold"> </span>
          <p
            style={{ width: "95%", margin: "10px auto", marginTop: 0 }}
            className="bg-light-off-white border border-gray-200 p-4 text-sm max-h-[30vh] overflow-scroll rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          >
            {/* {post.content ? "this is a description." :} */}
          </p>
        </h1>
        <div className="w-[95%] mx-auto flex flex-wrap">
          {post?.files?.length
            ? post.files.map((file, index) => {
                return (
                  <img
                    onClick={() => {
                      setCurrentIndex(index);
                      setCurrentSrcSet(srcSet[id]);
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

        <div className="w-full md:w-[95%] relative z-0 flex items-center justify-between mt-4 mx-[1.5vw]">
          <div className="w-fit s:max-w-[70%] flex justify-start items-center p-2 rounded-md -z-50">
            <div
              className="flex items-center gap-[10px] justify-center cursor-pointer z-99 w-[70px]"
              onClick={(e) => Upvote(e, post)}
            >
              {/* <FaRegArrowAltCircleUp
                style={{ zIndex: -1 }}
                className="text-white text-xl "
              /> */}
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
                style={{ zIndex: -1, fontSize: "20px" }}
                className="text-black"
              >
                {post.upvotes.length}
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
            <div
              onClick={() =>
                navigate(`/viewpost?id=${post._id}&avtar=${post.author.avtar}`)
              }
              className="flex gap-[10px] items-center justify-center cursor-pointer w-[70px]"
            >
              <svg
                height="30px"
                viewBox="0 -0.5 25 25"
                fill="black"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M9.0001 8.517C8.58589 8.517 8.2501 8.85279 8.2501 9.267C8.2501 9.68121 8.58589 10.017 9.0001 10.017V8.517ZM16.0001 10.017C16.4143 10.017 16.7501 9.68121 16.7501 9.267C16.7501 8.85279 16.4143 8.517 16.0001 8.517V10.017ZM9.8751 11.076C9.46089 11.076 9.1251 11.4118 9.1251 11.826C9.1251 12.2402 9.46089 12.576 9.8751 12.576V11.076ZM15.1251 12.576C15.5393 12.576 15.8751 12.2402 15.8751 11.826C15.8751 11.4118 15.5393 11.076 15.1251 11.076V12.576ZM9.1631 5V4.24998L9.15763 4.25002L9.1631 5ZM15.8381 5L15.8438 4.25H15.8381V5ZM19.5001 8.717L18.7501 8.71149V8.717H19.5001ZM19.5001 13.23H18.7501L18.7501 13.2355L19.5001 13.23ZM18.4384 15.8472L17.9042 15.3207L17.9042 15.3207L18.4384 15.8472ZM15.8371 16.947V17.697L15.8426 17.697L15.8371 16.947ZM9.1631 16.947V16.197C9.03469 16.197 8.90843 16.23 8.79641 16.2928L9.1631 16.947ZM5.5001 19H4.7501C4.7501 19.2662 4.89125 19.5125 5.12097 19.6471C5.35068 19.7817 5.63454 19.7844 5.86679 19.6542L5.5001 19ZM5.5001 8.717H6.25012L6.25008 8.71149L5.5001 8.717ZM6.56175 6.09984L6.02756 5.5734H6.02756L6.56175 6.09984ZM9.0001 10.017H16.0001V8.517H9.0001V10.017ZM9.8751 12.576H15.1251V11.076H9.8751V12.576ZM9.1631 5.75H15.8381V4.25H9.1631V5.75ZM15.8324 5.74998C17.4559 5.76225 18.762 7.08806 18.7501 8.71149L20.2501 8.72251C20.2681 6.2708 18.2955 4.26856 15.8438 4.25002L15.8324 5.74998ZM18.7501 8.717V13.23H20.2501V8.717H18.7501ZM18.7501 13.2355C18.7558 14.0153 18.4516 14.7653 17.9042 15.3207L18.9726 16.3736C19.7992 15.5348 20.2587 14.4021 20.2501 13.2245L18.7501 13.2355ZM17.9042 15.3207C17.3569 15.8761 16.6114 16.1913 15.8316 16.197L15.8426 17.697C17.0201 17.6884 18.1461 17.2124 18.9726 16.3736L17.9042 15.3207ZM15.8371 16.197H9.1631V17.697H15.8371V16.197ZM8.79641 16.2928L5.13341 18.3458L5.86679 19.6542L9.52979 17.6012L8.79641 16.2928ZM6.2501 19V8.717H4.7501V19H6.2501ZM6.25008 8.71149C6.24435 7.93175 6.54862 7.18167 7.09595 6.62627L6.02756 5.5734C5.20098 6.41216 4.74147 7.54494 4.75012 8.72251L6.25008 8.71149ZM7.09595 6.62627C7.64328 6.07088 8.38882 5.75566 9.16857 5.74998L9.15763 4.25002C7.98006 4.2586 6.85413 4.73464 6.02756 5.5734L7.09595 6.62627Z"
                    fill="#000000"
                  ></path>{" "}
                </g>
              </svg>
              <span
                className="
               text-black"
                style={{
                  fontSize: "20px",
                }}
              >
                {post?.comments?.length}
              </span>
            </div>
          </div>
          <div
            className={`${
              user.username == post.author.username ? "block" : "hidden"
            }`}
          >
            <button
              onClick={() => handleDelete(post._id)}
              className="block bg-red-500 px-4 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-red-600 rounded-xl ml-2"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[15vh] mb-[10vh]">
      <h1 className="text-center text-xl font-bold">Ready to Explore?</h1>
      <Autocomplete data={allstudents} />

      <h1 className="text-center text-xl font-bold">Popular Users</h1>
      <div className="relative my-4 flex items-center">
        <button
          onClick={() =>
            scrollLeft(document.getElementById("mostFollowedContainer"))
          }
          className="absolute left-4 md:left-20 z-1 p-4 bg-gray-800 hover:bg-gray-600 text-white rounded-full"
        >
          &#10094;
        </button>
        <div
          id="mostFollowedContainer"
          className="flex items-center flex-row overflow-x-auto no-scrollbar gap-5 w-[70%] mx-auto px-4"
        >
          {mostfollowed.map(createMostFollowedUsersDiv)}
        </div>
        <button
          onClick={() =>
            scrollRight(document.getElementById("mostFollowedContainer"))
          }
          className="absolute right-4 md:right-20 z-1 p-4 bg-gray-800 hover:bg-gray-600 text-white rounded-full"
        >
          &#10095;
        </button>
      </div>
      <h1
        className="text-center text-xl font-bold cursor-pointer"
        onClick={(e) => setPopularSnippetsOpen((prev) => !prev)}
      >
        Popular Snippets
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{
            margin: "0 10px",
            transform: popularSnippetsOpen && "rotate(180deg)",
            transitionDuration: "0.5s",
          }}
        />
      </h1>
      {popularSnippetsOpen && (
        <div className="relative my-4 flex items-center">
          <div
            id="mostFavouritedSnippets"
            className="flex items-center flex-row overflow-x-auto no-scrollbar gap-5 w-full mx-auto px-4"
          >
            {mostFavouritedSnippets &&
              mostFavouritedSnippets.map((snippet) => displaySnippets(snippet))}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          dispatch({ type: "UPDATE_FETCH_STATE", payload: false });
          sessionStorage.removeItem("posts");
          fetchPublicPosts();
          setPage(2);
        }}
        className="font-bold text-center flex gap-4 items-center text-xl m-auto mt-[25px] text-gray-400"
      >
        <FaArrowDown /> Fetch Latest Posts....{" "}
      </button>
      <div className="flex justify-center mx-auto my-5 w-full sm:w-[80%] md:w-[60%] flex-wrap gap-2">
        {tags.map((tag) => {
          return (
            <button
              key={tag}
              className={`block ${
                activeFeed === tag
                  ? "bg-black text-white"
                  : "bg-transparent text-black"
              } hover:bg-gray-800 hover:text-white font-semibold py-2 px-4 border border-black hover:border-transparent rounded transition-all duration-300 ease-in-out`}
              onClick={() => setActiveFeed(tag)}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {postsLoading ? (
        <SyncLoader className="w-fit mx-auto my-4" />
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={() => {
            fetchPublicPostsBatch(page);
            setPage(page + 1);
          }}
          hasMore={!fetched}
          endMessage={
            <p style={{ textAlign: "center" }}>
              {!followingFeedOpen && <b>Yay! You have seen it all</b>}
            </p>
          }
        >
          {followingFeedOpen
            ? null
            : feedPosts?.map((post, index) => {
                return createPostsDiv(post, index);
              })}
        </InfiniteScroll>
      )}

      {followingFeedOpen ? (
        <InfiniteScroll
          dataLength={followingFeed.length}
          next={() => {
            fetchPublicPostsBatch(page);
            setPage(page + 1);
          }}
          hasMore={!fetched}
          endMessage={
            <p style={{ textAlign: "center" }}>
              {followingFeedOpen && <b>Yay! You have seen it all</b>}
            </p>
          }
        >
          {followingFeed.map((post, index) => createPostsDiv(post, index))}
        </InfiniteScroll>
      ) : null}

      <DeleteConfirmation
        type="post"
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onDelete={handleDeletePost}
      />
    </div>
  );
};
