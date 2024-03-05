import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/header";
import "./styles/header.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Home from "./pages/Home";
import YourSnippets from "./pages/YourSnippets";
import AddSnippet from "./pages/AddSnippet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { useSelector } from "react-redux";
import ProtectedLoginRoutes from "./components/ProtectedLoginRoute";
function App() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  
  return (
    <>
      <Header />
      <ToastContainer />
      <Routes>
        <Route index element={<LoginPage />} />
        <Route element={<ProtectedLoginRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/yourSnippets" element={<YourSnippets />} />
          <Route path="/addSnippet" element={<AddSnippet />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
