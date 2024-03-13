import React, { useState } from 'react';
import { db } from '../components/firebase';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { auth } from '../components/firebase';
import '../styles/AddSnippet.css';
import generateUniqueId from 'generate-unique-id';
const snippetsDB = collection(db, "snippets");
import { toast } from "react-toastify"
import { Editor } from '@monaco-editor/react';

function AddSnippet() {
    const editorRef = React.useRef(null);
    const [lastId, setLastId] = useState(0);
    const [myOptions, setMyOptions] = useState(
        {
            fontSize: 20,
            fontFamily: 'monospace',
        }
    );

    async function handleAddSnippetFormSubmit(e) {
        e.preventDefault();
        let codeToBeSaved = '';
        if(editorRef){
            codeToBeSaved = editorRef.current.getValue();
        }else{
            toast.error("Some error occurred code cannot be empty");
            return;
        }
        let snippet = {
            id: lastId + 1,
            title: e.target.title.value,
            description: e.target.description.value,
            language: e.target.language.value,
            code: codeToBeSaved,
            username: auth.currentUser.displayName,
            uid: auth.currentUser.uid,
            snippetid: ''
        }
        console.log(auth.currentUser)
        setLastId(lastId + 1);
        console.log(snippet);
        try {
            const docref = await addDoc(snippetsDB, snippet);
            const updatedDoc = await updateDoc(doc(db, "snippets", docref.id), { snippetid: docref.id });
            console.log(docref.id);
            toast.success("snippet was added successfully!!")
            console.log("snippet was added successfully!!");
        } catch (e) {
            toast.error("Error adding document: ", e)
            console.log("Error adding document: ", e);
        }


        e.target.title.value = e.target.description.value = e.target.language.value  = '';
        editorRef.current.setValue('');
        return snippet;
    }

    function handleLanguageInput(e) {
        let language = e.target.value;
        if(editorRef){
            editorRef.current.language = language;
        }
    }

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        console.log(editor);
    }
    // myOptions = {
    //     fontSize: 25,
    //     fontFamily: 'monospace',
    // };
    return (
        <div id="addSnippetsDiv">
            <h1>Add Snippet</h1>
            <form onSubmit={handleAddSnippetFormSubmit}>

                <input type="text" placeholder="Title" name='title' required />
                <input type="text" placeholder="Description" name='description' required />
                <input type="text" placeholder="Language" name='language' onChange={handleLanguageInput} required />
                <button type='submit' className='addSnipBtn'>Add Snippet</button>
                {/* <textarea name="code" id="code" cols="30" rows="10" placeholder="Enter your code here" required></textarea> */}
                <div id="editorDiv">
                    <Editor
                        theme='vs-dark'
                        height={'80vh'}
                        width={'100%'}
                        options={myOptions}
                        onMount={handleEditorDidMount}
                    />
                </div>
            </form>
        </div>
    );
}

export default AddSnippet;