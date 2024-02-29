import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import LeftDiv from "./LeftDiv";
import { Routes, Route } from "react-router-dom";
function LoginAndRegister() {
    const [isUserRegistered, setRegistrationStatus] = useState(true);
    return (
        <div id="mainSignInPage">
            <LeftDiv />
            {isUserRegistered ? <LoginForm /> : <SignUpForm />}
        </div>
    )
}

export default LoginAndRegister;