import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export const FavouriteSnippets = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [userFavouriteSnippets, setUserFavouriteSnippets] = useState([]);

  async function fetchUserFavouriteSnippets() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}api/user/getfavouritesnippets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ username: user.username }),
        }
      );
      const data = await response.json();
      console.log(data);
      setUserFavouriteSnippets(data.favouriteSnippets);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user favourite snippets");
    }
  }

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

  useEffect(() => {
    if (user) fetchUserFavouriteSnippets();
  }, []);

  function createSnippetCards(snippet) {
    const month = getMonthFromIndex(
      Number.parseInt(snippet.dateCreated.split("-")[1]) - 1
    );
    const day = snippet.dateCreated.split("-")[2].split("T")[0];
    const date = `${month} ${day}`;

    return (
      <article
        key={snippet._id}
        className="flex bg-white transition hover:shadow-xl w-[29%] border-2 rounded-xl m-[20px] min-w-[340px]"
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
  return (
    <div className="mt-[10vh] flex flex-col md:flex-row items-center justify-center flex-wrap mb-[20vh]">
      {userFavouriteSnippets?.length
        ? userFavouriteSnippets.map((snippet) => createSnippetCards(snippet))
        :  <h1 className="text-center text-slate-400">Your favourite snippets will appear here!</h1>}
    </div>
  );
};
