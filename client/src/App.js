import logo from "./logo.svg";
import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Snippet } from "./pages/Snippet";
import { Profile } from "./pages/Profile";
import { Explore } from "./pages/Explore";
import { ViewPost } from "./pages/ViewPost";
import { useAuthContext } from "./hooks/useAuthContext";
import OAuth from "./pages/OAuth";
import { ViewProfile } from "./pages/ViewProfile";
import { ViewPublicSnippet } from "./pages/ViewPublicSnippet";
import { useEffect } from "react";
import News from "./pages/News";
import About from "./pages/About";
function App() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }
  , []);

  return (
    <>
      <ToastContainer stacked="true" theme="dark" />
      <Header userObj={user} />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/home" element={<Home />} />
        <Route path="/snippets" element={<Snippet />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/oauth" element={<OAuth />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/viewpost" element={<ViewPost />} />
        <Route path="/viewprofile" element={<ViewProfile />} />
        <Route path="/viewpublicsnippet" element={<ViewPublicSnippet />} />
        <Route path="/news" element={<News />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
