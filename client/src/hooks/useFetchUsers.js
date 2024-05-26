import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { toast } from "react-toastify";

export const useFetchUsers = () => {
  const [mostfollowed, setmostfollowed] = useState([]);
  const [publicUsersLoading, setPublicUsersLoading] = useState(false);
  const { dispatch, user } = useAuthContext();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const fetchPublicUsers = async () => {
    try {
      setPublicUsersLoading(true);
      const _users = JSON.parse(sessionStorage.getItem("public_users"));
      if (_users) {
        setmostfollowed(_users);
        dispatch({ type: "FETCH_USERS", payload: _users });
        setPublicUsersLoading(false);
        return;
      }
      const response = await fetch(BASE_URL + "api/public/mostfollowed", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      sessionStorage.setItem("public_users", JSON.stringify(data));
      let mostfollowedusers = data.filter((followedUser) => followedUser.username != user.username)
      dispatch({ type: "FETCH_USERS", payload: mostfollowedusers });
      setmostfollowed(mostfollowedusers);
    } catch (error) {
      console.error(error.message);
      toast.error(
        "Sorry! Something went wrong! We are having trouble fetching users!"
      );
    } finally {
      setPublicUsersLoading(false);
    }
  };
  return { fetchPublicUsers, publicUsersLoading, mostfollowed };
};
