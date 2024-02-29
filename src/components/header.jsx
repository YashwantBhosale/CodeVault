import React from "react";
import { Link } from "react-router-dom";
import '../styles/header.css'
function Header(){
    return (
        <header>
            <ul id="navList">
                <li id="logo">CodeVault</li>
                <li><Link to='/home'>Home</Link></li>
                <li>About</li>
                <li>Your Snippets</li>
            </ul>
        </header>
    ) 
}

export default Header;