import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast } from "react-toastify";
export const Likebutton = ({snippetId}) => {
  const [fillColor, setFillColor] = useState("#000000");
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { user, dispatch } = useAuthContext();

  function handleLocalFavourites(snippetId) {
    //   if(user.favouriteSnippets){
    //     if (user?.favouriteSnippets?.includes(snippetId)) {
    //     user.favouriteSnippets = user.favoriteSnipeets.filter((id) => id !== snippetId);

    //   localStorage.setItem("user", JSON.stringify(user));
    //   dispatch({type: "UPDATE", payload: user});
    //   }else {
    //     user.favouriteSnippets.push(snippetId);
    //     localStorage.setItem("user", JSON.stringify(user));
    //     dispatch({type: "UPDATE", payload: user});
    //   }
    // }

    //   else{
    //     user.favouriteSnippets = [];
    //     user.favouriteSnippets.push(snippetId);
    //   }

    if (user.favouriteSnippets) {
      /* if (user?.favouriteSnippets?.includes(snippetId)) {
        user.favouriteSnippets = user.favouriteSnippets.filter((id) => id !== snippetId);
      } else {
        user.favouriteSnippets.push(snippetId);
      }*/
      if (user.favouriteSnippets?.some((id) => id === snippetId)) {
        user.favouriteSnippets = user.favouriteSnippets.filter(
          (id) => id !== snippetId
        );
      }
      else{
        user.favouriteSnippets.push(snippetId);
      }
    } else {
      user.favouriteSnippets = [];
      user.favouriteSnippets.push(snippetId);
    }
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "UPDATE", payload: user });
  }

  useEffect(() => {
    if (user.favouriteSnippets?.some((id) => id === snippetId)) {
      setFillColor("black");
    } else {
      setFillColor("white");
    }
  }, [user]);

  async function handleAddToFavorites(snippetId) {
    handleLocalFavourites(snippetId);
    try {
      await fetch(BASE_URL + "api/user/handleFavouriteSnippet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          email: user.email,
          snippetId,
        }),
      })

      toast.success("Added to favourite Snippets!!")
    }catch(error){
      console.error(error.message);
    }
  }

  return (
    <button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 74 74"
        height="40px"
        width="40px"
        fill={user.favouriteSnippets?.includes(snippetId) ? "black" : "white"}
        stroke="black"
        onClick={() => handleAddToFavorites(snippetId)}
      >
        <circle
          class="circle"
          cx="37"
          cy="37"
          r="36"
          stroke-width="1.7"
          fill="transparent"
          stroke="black"
        ></circle>
        <path
          class="checked"
          d="M53.8 25a9.94 9.94 0 0 0-7.46-3.4A9.94 9.94 0 0 0 38.9 25L37 27.06 35.1 25a9.94 9.94 0 0 0-7.44-3.4A9.94 9.94 0 0 0 20.2 25a12.36 12.36 0 0 0 0 16.16l2.03 2.25 11.41 12.63.62.6c.23.18.48.34.74.47.6.33 1.23.49 1.95.49h.08a4 4 0 0 0 1.95-.49c.26-.13.5-.29.74-.47l.62-.6L51.76 43.4l2.03-2.25a12.36 12.36 0 0 0 0-16.16"
        ></path>
        <g transform="translate(17.2 21.6)">
          <path
            class="unchecked"
            d="M36.59 3.4A9.92 9.92 0 0 0 29.15 0a9.92 9.92 0 0 0-7.44 3.4l-1.93 2.06-1.9-2.06A9.92 9.92 0 0 0 10.44 0 9.92 9.92 0 0 0 3 3.4c-4 4.45-4 11.7 0 16.16l2.03 2.25 11.4 12.63.62.6a4.44 4.44 0 0 0 5.55 0l2.02-2.12.04-.04c.3-.32.49-.78.49-1.29 0-1-.8-1.88-1.81-1.88-.48 0-.88.18-1.23.5l-.05.05-.04.05-.97 1-.53.6c-.13.14-.35.37-.74.37-.36 0-.62-.23-.75-.37l-.53-.6-8.54-9.45-4.36-4.82a8.4 8.4 0 0 1 0-11.07 6.49 6.49 0 0 1 4.84-2.25c1.8 0 3.52.78 4.85 2.25l4.49 4.96 4.49-5a6.49 6.49 0 0 1 4.84-2.26c1.8 0 3.52.78 4.84 2.25a8.4 8.4 0 0 1 0 11.07l-1.06 1.2-.04.04c-.3.32-.49.78-.49 1.29 0 1 .8 1.88 1.8 1.88.54 0 .98-.23 1.33-.6l1.14-1.24A12.42 12.42 0 0 0 36.6 3.4m-4.23 19.74h-2.02v-2.06c0-1.01-.8-1.89-1.8-1.89-1.02 0-1.81.83-1.81 1.89v2.06h-1.98c-1.01 0-1.8.83-1.8 1.89 0 1.05.79 1.88 1.8 1.88h1.98v2.06c0 1.01.8 1.89 1.8 1.89 1.02 0 1.81-.83 1.81-1.89v-2.06h1.98c1.01 0 1.8-.83 1.8-1.88 0-1.06-.79-1.89-1.76-1.89"
          ></path>
        </g>
      </svg>
    </button>
  );
};
