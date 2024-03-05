import React from "react";
import LeftDiv from '../components/LeftDiv'
import LoginForm from '../components/LoginForm'
import '../styles/LoginPage.css'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function LoginPage(){
    return (
        <div className="mainSignInPage">
            <LeftDiv />
            <LoginForm />
        </div>
    )
}

export default LoginPage;