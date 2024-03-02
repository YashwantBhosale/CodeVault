import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/header.css'
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/reducer";


function Header() {
    const userLoginStatus = useSelector(state => state.loginStatus.isLoggedIn);
    console.log("userLoginStatus", userLoginStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <header>
            <ul id="navList">
                <li id="logo">CodeVault</li>
                <li><Link to='/home'>Home</Link></li>
                <li>About</li>
                <li><Link to='/addSnippet'>Add a Snippet</Link></li>
                {
                    userLoginStatus ?
                        <li onClick={() =>{dispatch(logout());}}><Link to='/login'>Logout</Link></li> :
                        <li><Link to='/login'>Login</Link></li>
                }
            </ul>
        </header>
    )
}

export default Header;