import React, { useState } from 'react';
import { db } from '../components/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { auth } from '../components/firebase';
import '../styles/AddSnippet.css';
const snippetsDB = collection(db, "snippets");

function AddSnippet() {
    const [lastId, setLastId] = useState(0);
    function handleAddSnippetFormSubmit(e) {
        e.preventDefault();
        let snippet = {
            id: lastId + 1,
            title: e.target.title.value,
            description: e.target.description.value,
            language: e.target.language.value,
            code: e.target.code.value,
            username: auth.currentUser.displayName,
            uid: auth.currentUser.uid
        }
        console.log(auth.currentUser)
        setLastId(lastId + 1);
        console.log(snippet);
        try{
            const docref = addDoc(snippetsDB, snippet);
            console.log(docref.id);
            console.log("snippet was added successfully!!");
        }catch(e){
            console.error("Error adding document: ", e);
        }


        e.target.title.value = e.target.description.value = e.target.language.value = e.target.code.value = ''; 
        return snippet;
    }
    return (
        <div id="addSnippetsDiv">
            <h1>Add Snippet</h1>
            <form onSubmit={handleAddSnippetFormSubmit}>
                <input type="text" placeholder="Title" name='title' required/>
                <input type="text" placeholder="Description" name='description' required/>
                <input type="text" placeholder="Language" name='language' required/>
                <textarea name="code" id="code" cols="30" rows="10" placeholder="Enter your code here" required></textarea>
                <button type='submit'>Add Snippet</button>
            </form>
        </div>
    );
}

export default AddSnippet;