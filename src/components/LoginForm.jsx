import React, { useState } from "react";
import { BrowserRouter, Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { login } from "../redux/reducer";
import { toast } from "react-toastify";
function LoginForm(props) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleLogIn(e) {
    e.preventDefault();
    dispatch(login());
    const { email, password } = formData;
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password).then(
          (userCredential) => {
            console.log(
              "Login successful .. welcome ",
              userCredential.user.displayName
            );
            toast.success(`Login successful ..  Welcome, ${userCredential.user.displayName}`);
            navigate("/home");
          }
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }

  function handleFormData(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <div id="signInDiv" className="rightDiv">
      <h1>Sign in</h1>
      <form onSubmit={handleLogIn}>
        <input
          onChange={handleFormData}
          type="email"
          name="email"
          placeholder="Enter your email"
        />
        <input
          onChange={handleFormData}
          type="password"
          name="password"
          placeholder="Enter your password"
        />
        <button onChange={handleFormData} type="submit">
          Log in
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <Link id="signUpBtn" to="/signUp">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
