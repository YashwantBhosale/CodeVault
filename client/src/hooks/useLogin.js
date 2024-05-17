import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";
import {toast} from "react-toastify"
import { set } from "mongoose";
import { useNavigate } from "react-router";

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();
    const loginWithEmail = async (email, password) => {
        setIsLoading(true);
        console.log(email, password);
        const response = await axios.post("http://localhost:4000/api/user/loginwithemail", {
            email,
            password
        });
        
        if(response.status != 200) {
            setIsLoading(false);
            toast.error("Sorry! something went wrong! Please try again!")
            console.log("Something went wrong. Please try again later.");
        } else {
            localStorage.setItem("user", JSON.stringify(response.data));
            dispatch({ type: "LOGIN", payload: response.data });
            setIsLoading(false);
            console.log("Login successful!");
            toast.success("Login successful!");
        }

    }

    const loginWithUsername = async (username, password) => {
        setIsLoading(true);
        console.log(username, password);
        const response = await axios.post("http://localhost:4000/api/user/loginwithusername", {
            username,
            password
        });

        if(response.status != 200) {
            setIsLoading(false);
            console.log("Something went wrong. Please try again later.");
            toast.error("Sorry! We are facing some issues with server!");
        }else{
            localStorage.setItem("user", JSON.stringify(response.data));
            dispatch({ type: "LOGIN", payload: response.data });
            setIsLoading(false);
            toast.success("Login Successful!");
        }
    }

    const loginWithOAuth = async () => {
        setIsLoading(true);
        const response  = await axios.get("http://localhost:4000/api/user/login/success",{
            withCredentials: true

        });
        if(response.status != 200) {
            setIsLoading(false);
            console.log("Something went wrong. Please try again later.");
            // toast.error("Sorry! We are facing some issues with server!");
        }
        else {
            console.log(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            dispatch({ type: "LOGIN", payload: response.data.user });
            setIsLoading(false);
            toast.success("Login Successful!");
            navigate("/");
        }
    }

    return {loginWithEmail, loginWithUsername,isLoading, loginWithOAuth}
}