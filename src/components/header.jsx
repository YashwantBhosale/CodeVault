import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/header.css";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../redux/reducer";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(login());
      console.log("user is logged in");
    } else {
      dispatch(logout());
      console.log("user is logged out");
    }
  });

  const userLoginStatus = useSelector((state) => state.loginStatus.isLoggedIn);
  console.log("userLoginStatus", userLoginStatus);

  return (
    <header>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>
      <ul id="navList" className={menuOpen ? "open" : ""}>
        <li id="logo">CodeVault</li>
        <div>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>About</li>
          <li>
            <Link to="/addSnippet">Add a Snippet</Link>
          </li>
          {userLoginStatus ? (
            <li
              onClick={() => {
                console.log("Dispatched logout")
                dispatch(logout());
                signOut(auth)
              }}
            >
              <Link to="/login">Logout</Link>
            </li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </div>
      </ul>
    </header>
  );
}

export default Header;
