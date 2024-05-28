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
import { useEffect, useState } from "react";
import News from "./pages/News";
import About from "./pages/About";
import ChatroomDashboard from "./pages/ChatroomDashboard";
import Room from "./pages/Room";
import { ChatroomButton } from "./components/ChatroomButton";
import { FavouriteSnippets } from "./pages/FavouriteSnippets";

function App() {
  const { user, userLoading } = useAuthContext();
  const navigate = useNavigate();
  const [allStudents, setAllStudents] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  async function fetchAllUsers() {
    try {
      const response = await fetch(BASE_URL + "api/public/getallusers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setAllStudents(data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // if (!userLoading && !user) {
  //   return <Navigate to="/login" />;
  // }
  console.log("userloading:", userLoading);

  return (
    <>
      <ToastContainer stacked="true" theme="dark" />
      <Header userObj={user} />

      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <Login />
            ) : userLoading ? (
              <h1>Loading....</h1>
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !user ? (
              <Login />
            ) : userLoading ? (
              <h1>Loading....</h1>
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !user ? (
              <SignUp />
            ) : userLoading ? (
              <h1>Loading....</h1>
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/home"
          element={
            user ? (
              <Home />
            ) : userLoading ? (
              <h1>Loading....</h1>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/snippets"
          element={
            user ? (
              <Snippet />
            ) : userLoading ? (
              <h1>Loading....</h1>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              <Profile />
            ) : userLoading ? (
              <h1>Loading....</h1>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/oauth" element={<OAuth />} />
        <Route
          path="/explore"
          element={
            user ? (
              <Explore />
            ) : userLoading ? (
              <h1>Loading....</h1>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/viewpost"
          element={
            user ? (
              <ViewPost />
            ) : userLoading ? (
              <h1>Loading....</h1>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/viewprofile"
          element={
            user ? (
              <ViewProfile />
            ) : userLoading ? (
              <h1>Loading....</h1>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/viewpublicsnippet"
          element={
            user ? (
              <ViewPublicSnippet />
            ) : userLoading ? (
              <h1>Loading....</h1>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/news" element={<News />} />
        <Route
          path="/chatroom"
          element={
            user ? (
              <ChatroomDashboard />
            ) : userLoading ? (
              <h1>Loading....</h1>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/room/:roomId"
          element={<Room allStudents={allStudents} />}
        />
        <Route path="/favourites" element={<FavouriteSnippets />} />
      </Routes>
      <Footer />
      <ChatroomButton />
    </>
  );
}

export default App;
