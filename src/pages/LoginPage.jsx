import React from "react";
import LeftDiv from '../components/LeftDiv'
import LoginForm from '../components/LoginForm'
import '../styles/LoginPage.css'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { config } from "dotenv";
import { Analytics } from "@vercel/analytics/react"
// import { defineConfig } from "vite";
function LoginPage(){
    return (
        <div className="mainSignInPage">
            <LeftDiv />
            <LoginForm />
            <Analytics />
        </div>
    )
}

export default LoginPage;