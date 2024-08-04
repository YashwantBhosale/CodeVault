import logo from "./logo.svg";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
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

  if (userLoading) {
    return <h1>Loading....</h1>;
  }

  return (
    <>
      <ToastContainer stacked="true" theme="dark" />
      <Header userObj={user} />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/home" /> : <SignUp />}
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/snippets"
          element={user ? <Snippet /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route path="/oauth" element={<OAuth />} />
        <Route
          path="/explore"
          element={user ? <Explore /> : <Navigate to="/login" />}
        />
        <Route
          path="/viewpost"
          element={user ? <ViewPost /> : <Navigate to="/login" />}
        />
        <Route
          path="/viewprofile"
          element={user ? <ViewProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/viewpublicsnippet"
          element={user ? <ViewPublicSnippet /> : <Navigate to="/login" />}
        />
        <Route path="/news" element={<News />} />
        <Route
          path="/chatroom"
          element={user ? <ChatroomDashboard /> : <Navigate to="/login" />}
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
