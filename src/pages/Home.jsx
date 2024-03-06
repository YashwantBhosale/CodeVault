import React, { useEffect, useState } from "react";
// import {auth, app} from "../components/firebase";

import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
// import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
// import firebase from "firebase/compat/app";
// Required for side-effects
import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import snippets from "../assets/snippets";
import { app, auth, db } from "../components/firebase";
import { browserSessionPersistence, setPersistence } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/reducer";
const snippetsDB = collection(db, "snippets");

// fetchData();
let areSnippetsFetched = false;

function Home() {
  const dispatch = useDispatch();
  const [name, setName] = useState("User");
  const navigate = useNavigate();
  const [userSnippets, setUserSnippets] = useState([]);
  let mySnippets = [];
  let uid = null;

  const [loggedInUser, setLoggedInUser] = useState(null);

  // Dummy function for reference
  async function fetchData() {
    const querySnapshot = await getDocs(collection(db, "snippets"));
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  }

  // Function to fetch snippets
  async function fetchSnippets(uid) {
    let mySnippets = [];
    const myQuery = query(snippetsDB, where("uid", "==", uid));
    const querySnapshot = await getDocs(myQuery);
    querySnapshot.forEach((doc) => {
      let temp = doc.data();
      mySnippets.push(temp);
    });
    return mySnippets;
  }

  // Check if a user is logged in when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is logged in from onAuthStateChanged");
        uid = auth.currentUser.uid;
        setLoggedInUser(user);
      } else {
        console.log("No user is logged in from onAuthStateChanged");
        setLoggedInUser(null);
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  // Fetch snippets when loggedInUser changes
  useEffect(() => {
    if (loggedInUser) {
      fetchSnippets(loggedInUser.uid)
        .then((snippets) => {
          setUserSnippets(snippets);
        })
        .catch((error) => {
          console.error("Error fetching snippets:", error);
        });
    } else {
      console.log("no user is logged in!");
    }
  }, [loggedInUser]);

  function openSnippet(snippetId) {
    console.log(snippetId);
    navigate("/yourSnippets?id=" + `${snippetId}`);
  }

  async function deleteSnippet(snippetId) {
    let docRef = doc(db, "snippets", snippetId);
    await deleteDoc(docRef);
    setUserSnippets(
      userSnippets.filter((snippet) => snippet.snippetid !== snippetId)
    );
    console.log("Snippet deleted with id: ", snippetId);
    console.log("User snippets after deletion: ", userSnippets);
  }

  function displaySnippets(snippet) {
    return (
      <div className="flip" key={snippet.snippetid}>
        <div className="front">
          <h1 className="text-shadow">{snippet.title}</h1>
          <p>{snippet.description}</p>
          <p>Language - {snippet.language}</p>
        </div>
        <div className="back">

          <div className="btnContainer">
            <button onClick={() => openSnippet(snippet.snippetid)}>
              Open snippet
            </button>
            <button onClick={() => deleteSnippet(snippet.snippetid)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  function handleLogOut(user) {
    dispatch(logout());
    signOut(auth);
    navigate("/");
  }

  function handleAddSnippet() {
    navigate("/addSnippet");
  }

  useEffect(() => {
    console.log("currently logged in user : ", loggedInUser);
    if (loggedInUser) {
      setName(loggedInUser.displayName);
    }
  }, [loggedInUser]);

  console.log(userSnippets);
  return (
    <div className="primaryBackground">
      <h1> Welcome {name}!</h1>
      
      <div className="snippetContainer">
      <div className="flip" onClick={handleAddSnippet}>
          <div className="front">
            <h1 className="text-shadow">Add a Snippet</h1>
            <p>Click here to add a new snippet</p>
          </div>
          <div className="back">
            <div className="btnContainer">
              <button>+</button>
            </div>
          </div>
        </div>
        {userSnippets.map(displaySnippets)}
        
      </div>
    </div>
  );
}

export default Home;
