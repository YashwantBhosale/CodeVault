import React from "react";
import LeftDiv from '../components/LeftDiv'
import LoginForm from '../components/LoginForm'
import '../styles/LoginPage.css'

function LoginPage(){

    return (
        <div className="mainSignInPage">
            <LeftDiv />
            <LoginForm />
        </div>
    )
}

export default LoginPage;