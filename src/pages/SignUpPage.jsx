import React from "react";
import LeftDiv from "../components/LeftDiv";
import SignUpForm from "../components/SignUpForm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
    return (
    <div className="mainSignInPage">
        <LeftDiv />
        <SignUpForm />
    </div>)
}

export default SignUpPage;