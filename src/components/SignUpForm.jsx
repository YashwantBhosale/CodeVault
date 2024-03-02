import React, { useState } from "react";
import { BrowserRouter, Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
import {auth} from "./firebase";
import { useDispatch } from "react-redux";
import { login, logout } from "../redux/reducer";



function SignUpForm(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    function handleSignUp(e) {
        e.preventDefault();
        dispatch(login());
        // props.onSubmit(formData);
        // function handleSignUpSubmit(formData) {
        //     const { username, email, password } = formData;
        //     createUserWithEmailAndPassword(auth, email, password)
        //         .then((userCredential) => {
        //             console.log("registration successful");
        //             const user = userCredential.user;
        //             updateProfile(user, {
        //                 displayName: username,
        //             })
        //         })

        const { username, email, password } = formData;
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('registration successful ..');
                const user = userCredential.user;
                updateProfile(user, {
                    displayName: username
                })
                console.log("Welcome ", username);
                navigate('/home');
            })

    }



    function handleFormData(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    return (

        <div id="signUpDiv" className="rightDiv">
            <h1>Sign Up</h1>
            <form onSubmit={handleSignUp}>
                <input onChange={handleFormData} value={formData.username} type="text" name="username" placeholder="Enter your username" />
                <input onChange={handleFormData} value={formData.email} type="email" name="email" placeholder="Enter your email" />
                <input onChange={handleFormData} value={formData.password} type="password" name="password" placeholder="Enter your password" />
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <Link id="logInBtn" to="/">Login</Link></p>
        </div>

    )
}

export default SignUpForm;