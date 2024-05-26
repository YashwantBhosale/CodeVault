import { useState,  } from "react";
import { useAuthContext } from "./useAuthContext";
import { toast } from "react-toastify";

export const useFetchPosts = () => {
  const [postsLoading, setPostsLoading] = useState(false);
  const { dispatch, user } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  async function fetchPublicPosts() {
    try {
      setPostsLoading(true);
      const _posts = JSON.parse(sessionStorage.getItem("posts"));
      if (_posts) {
        setPosts(_posts);
        dispatch({ type: "FETCH_POSTS", payload: _posts });
        setPostsLoading(false);
        return;
      } else {
        const response = await fetch(BASE_URL + `api/public/getpublicposts?page=1&username=${user.username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("posts : ", data);
        setPosts(data);
        sessionStorage.setItem("posts", JSON.stringify(data));
        dispatch({ type: "FETCH_POSTS", payload: data });
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Sorry! Something went wrong! We are having trouble fetching posts!");
    }finally{
      setPostsLoading(false);
    }
  }

  async function fetchPublicPostsBatch(page) {
    try {
      console.log(page);
      const currentPage = page || 1;
      const response = await fetch(
        BASE_URL + `api/public/getpublicposts?page=${page}&username=${user.username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("data: ", data);
      const newPosts = [...posts, ...data];
      console.log(newPosts)
      dispatch({ type: "UPDATE_POSTS", payload: newPosts });

      sessionStorage.setItem("public_posts", JSON.stringify(newPosts));
      if (data.length < 10) {
        dispatch({ type: "UPDATE_FETCH_STATE", payload: true });
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Error fetching posts");
    }
  }

  return { fetchPublicPosts, fetchPublicPostsBatch, postsLoading, posts };
};
