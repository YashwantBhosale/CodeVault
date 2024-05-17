import React, { useEffect } from 'react'
import {useLogin} from '../hooks/useLogin'
import { useNavigate } from 'react-router';

function Test() {
    const navigate = useNavigate();
    const {loginWithOAuth} = useLogin();

    useEffect(() => {
        loginWithOAuth();
        if(localStorage.getItem("user")) {
            console.log("User is logged in!")
            navigate("/home");
        } else {
            console.log("User is not logged in!")
        }
    }
    ,[])



  return (
    <div>Test</div>
  )
}

export default Test