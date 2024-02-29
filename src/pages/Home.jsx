import React, { useEffect, useState } from "react";
// import {auth, app} from "../components/firebase";

import { useNavigate } from "react-router-dom";
import '../styles/Home.css'
// import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
// import firebase from "firebase/compat/app";
// Required for side-effects
import { collection, getFirestore, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
import snippets from "../assets/snippets";
import { app, auth } from "../components/firebase";
import { browserSessionPersistence, setPersistence } from "firebase/auth";
const db = getFirestore(app);
const snippetsDB = collection(db, "snippets");

// fetchData();
let areSnippetsFetched = false;

function Home() {
    setPersistence(auth, browserSessionPersistence);
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
        })

    }

    // Function to fetch snippets
    async function fetchSnippets(uid) {
        let mySnippets = [];
        const myQuery = query(snippetsDB, where('uid', '==', uid));
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
        }
    }, [loggedInUser]);

    function openSnippet(snippetId) {
        console.log(snippetId);
        navigate('/yourSnippets/:' + `${snippetId}`)
    }


    function displaySnippets(snippet) {
        return (
            <div className="snippetCards" key={snippet.snippetid} onClick={() => { openSnippet(snippet.id) }}>
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
    // getQueryData(myQuery)
    // console.log("userSnippets : ", userSnippets);
    return (
        <div className="primaryBackground">
            <h1> Welcome User</h1>
            <button onClick={handleLogOut}>Log out</button>
            <div className="snippetContainer">
                {userSnippets.map(displaySnippets)}
            </div>
        </div>
    )

}

export default Home;