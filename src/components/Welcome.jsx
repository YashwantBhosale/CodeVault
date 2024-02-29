import React from "react";
import auth from "./firebase";
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
import { Route, Routes, useNavigate } from "react-router-dom";
import '../styles/Homepage.css'
import { Editor } from "@monaco-editor/react";

let snippets = [{
    id: 1,
    title: "My card",
    description: "This is a simple html card",
    code: `<div class="card">
    <img src="img_avatar.png" alt="Avatar" style="width:100%">
    <div class="container">
      <h4><b>John Doe</b></h4>
      <p>Architect & Engineer</p>
    </div>
  </div>`
},
{
    id: 2,
    title: "My card",
    description: "This is a simple html card",
    code: `<div class="card">
    <img src="img_avatar.png" alt="Avatar" style="width:100%">
    <div class="container">
      <h4><b>John Doe</b></h4>
      <p>Architect & Engineer</p>
    </div>
  </div>`
},
{
    id: 3,
    title: "My card",
    description: "This is a simple html card",
    code: `<div class="card">
    <img src="img_avatar.png" alt="Avatar" style="width:100%">
    <div class="container">
      <h4><b>John Doe</b></h4>
      <p>Architect & Engineer</p>
    </div>
  </div>`
}

]


function Welcome(props) {
    const navigate = useNavigate();

    function openSnippet(e) {
        console.log(e.target.id);
        navigate(`/yourSnippets/:${e.target.id}`)

    }


    function displaySnippets(snippet) {
        return (
            <div className="snippetCards" id={snippet.id} onClick={openSnippet} onMouseOver={console.log("mousein")}>
                <h3>{snippet.title}</h3>
                <p>{snippet.description}</p>
                <p>{snippet.code}</p>
            </div>
        )
    }

    function handleLogOut(user) {
        signOut(auth);
        navigate('/');
    }

    // onAuthStateChanged(auth, (user) => {

    // })

    return (
        <div className="primaryBackground">
            <h1> Welcome {props.username}</h1>
            <button onClick={handleLogOut}>Log out</button>
            <div className="snippetContainer">
                {snippets.map(displaySnippets)}
            </div>
            <Routes>
                <Route path="/yourSnippets" element={<Editor theme="vs-dark" height="100vh" width="100%" defaultValue="Hello wotld" />} />
            </Routes>
        </div>
    )
}

export default Welcome;
