import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { iconSrcList } from "../utils/icons";
import { SyncLoader } from "react-spinners";
import {
  FaFontAwesome,
  FaRegArrowAltCircleDown,
  FaRegArrowAltCircleUp,
  FaUser,
  FaRegComment,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";

export const ViewProfile = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
  const [currentuser, setCurrentUser] = React.useState({});
  const { user, dispatch } = useAuthContext();
  const [snippetsWindow, setSnippetsWindow] = useState(true);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

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
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
      });
    };
  }, []);

  function localFollow(e, userObj) {
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

  async function fetchUser() {
    try {
      const response = await fetch(
        BASE_URL + `api/public/viewuser?username=${username}`
      );
      const data = await response.json();
      console.log(data);
      setCurrentUser(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);
  // http://localhost:3000/viewprofile?username=%22bluepanda69%22

  function truncateDescription(description, maxLength) {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + "...";
    }
    return description;
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

  function createSnippetCards(snippet) {
    const month = getMonthFromIndex(
      Number.parseInt(snippet.dateCreated.split("-")[1]) - 1
    );
    const day = snippet.dateCreated.split("-")[2].split("T")[0];
    const date = `${month} ${day}`;

    return (
      <article
        key={snippet._id}
        className="flex bg-white transition hover:shadow-xl w-[29%] border-2 rounded-xl m-[20px] min-w-[340px] s:min-w-[300px]"
      >
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
              {truncateDescription(snippet.description || "N/A", 40)}
            </p>
            <p>
              <span className="font-bold text-gray-900">Language:</span>{" "}
              {snippet.language}
            </p>
          </div>
          <div className="flex items-end justify-end">
            <button
              onClick={() =>
                navigate(`/viewpublicsnippet?snippetId=${snippet._id}`)
              }
              className="block bg-black px-5 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-slate-600 rounded-br-xl mt-2 ml-2"
            >
              View Snippet
            </button>
          </div>
        </div>
      </article>
    );
  }

  function createPostCards(post) {
    return (
      <div
        key={post._id}
        className="w-[90%] md:w-[60%] mx-auto border border-gray-300 p-4 rounded-lg shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] mb-8" // shadow-[rgba(0,_0,_0,_0.2)_0px_10px_10px]
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
            dangerouslySetInnerHTML={{ __html: post.content }}
          >
            {/* {post?.content || "this is a description."} */}
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
      </div>
    );
  }
  return (
    <div className="mx-auto mt-[20vh] pb-[15vh]">
      <div
        className={`w-fit px-[15px] h-fit min-h-[30vh] md:w-[45%] s:w-[70%] overflow-y-scroll rounded-xl p-4 flex shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] mx-auto items-center  justify-center ${
          windowWidth < 500 ? "flex-col" : ""
        }`}
      >
        <div className="h-full w-fit px-[15px] mr-[20px] flex flex-col items-center justify-between">
          <img
            src={
              currentuser?.avtar?.length > 15
                ? currentuser.avtar
                : iconSrcList[currentuser?.avtar]
            }
            alt={currentuser.username}
            className="h-24 w-24 rounded-full object-cover "
          />
          <h2 className="font-bold text-xl">{currentuser.username}</h2>
        </div>

        <div className="h-full flex flex-col w-full s:mt-4 max-w-[380px]">
          <div className="flex justify-between md:mt-4">
            <div className="flex flex-col items-center justify-between">
              <p className="text-4xl font-light">
                {currentuser.followers?.length}
              </p>
              <p className="text-sm">Followers</p>
            </div>
            <div className="flex flex-col items-center justify-between">
              <p className="text-4xl font-light">
                {currentuser.following?.length}
              </p>
              <p className="text-sm">Following</p>
            </div>
            <div className="flex flex-col items-center justify-between ml-4">
              <p className="text-4xl font-light">
                {currentuser.publicPosts?.length}
              </p>
              <p className="text-sm">Posts</p>
            </div>
          </div>
          <button
            onClick={(e) =>
              handleFollowButton(e, {
                id: currentuser.id,
                username: currentuser.username,
                avtar: currentuser.avtar,
              })
            }
            className="w-full text-white bg-black hover:bg-slate-700  rounded-lg text-md p-2 mx-auto mt-4 block"
          >
            {user?.following.some(
              (followingUser) => followingUser.username === currentuser.username
            )
              ? "Unfollow"
              : "Follow"}
          </button>
        </div>
      </div>
      <div className="w-fit mx-auto my-6">
        <button
          type="button"
          class="p-2.5 m-2 text-md font-md rounded-xl text-white bg-black focus:ring-gray-100 focus:ring-4 focus:bg-slate-700 hover:bg-slate-700 w-[100px]"
          onClick={() => setSnippetsWindow(true)}
        >
          Snippets
        </button>
        <button
          type="button"
          class=" p-2.5 m-2 text-md font-md rounded-xl text-white bg-black focus:ring-gray-100 focus:ring-4 focus:bg-slate-700 hover:bg-slate-700 w-[100px]"
          onClick={() => setSnippetsWindow(false)}
        >
          Posts
        </button>
      </div>
      {snippetsWindow ? (
        <div className="mb-10">
          {" "}
          {/* <h2>Snippets</h2> */}
          <div className="flex flex-wrap w-[95%] m-auto justify-center">
            {currentuser.publicSnippets?.map(createSnippetCards)}
          </div>
        </div>
      ) : (
        <div className="mb-10">
          {/* <h2>Posts</h2> */}
          {currentuser.publicPosts?.map(createPostCards)}
        </div>
      )}
    </div>
  );
};
