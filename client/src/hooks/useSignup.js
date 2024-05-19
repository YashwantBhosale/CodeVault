import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { toast } from "react-toastify";
import iconsList from "../utils/icons";
import axios from "axios";

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  async function signup(username, email, password) {
    setIsLoading(true);
    try {
      const randomIndex = Math.floor(Math.random()*iconsList.length);
      console.log(randomIndex);
      const avtar = iconsList[randomIndex];

      const response = await axios.post(process.env.REACT_APP_BASE_URL+"api/user/signup", {
        username,
        email,
        password,
        avtar,
      });
      console.log(response);
      if (response.status != 200) {
        setIsLoading(false);
        console.log("response: ", )
        toast.error("Something went wrong. Please try again later.");
      } else {
        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch({ type: "LOGIN", payload: response.data });
        setIsLoading(false);
        toast.success("Signup successful");
      }
    } catch (error) {
      setIsLoading(false);
      console.log("error: ", error.message);
      toast.error("Something went wrong. Please try again later.");
    }
  }
  return { signup, isLoading };
};
