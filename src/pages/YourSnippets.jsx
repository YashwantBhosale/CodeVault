import React, { useState, useEffect, useReducer, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Editor, useMonaco } from "@monaco-editor/react";
import snippets from "../assets/snippets";
import { db } from "../components/firebase";
import { toast } from "react-toastify";
import {
  query,
  collection,
  getDocs,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
const snippetsDB = collection(db, "snippets");
import "../styles/YourSnippets.css";

function YourSnippets() {
  const [snippet, setSnippet] = useState({});
  let responseSnippet = {};
  const editorRef = useRef(null);

  const [searchParams] = useSearchParams();
  let id = searchParams.get("id");
  console.log(id);
  let myOptions = {
    // fontSize: 25,
    colorDecorators: true,
    workspaceFileEditOptions: {
      folder: true,
    },
    fontSize: 20,
    fontFamily: "monospace",
  };

  useEffect(() => {
    async function getSnippet(id) {
      try {
        let dbQuery = query(snippetsDB, where("snippetid", "==", id));
        const querySnapshot = await getDocs(dbQuery);
        responseSnippet = querySnapshot.docs[0].data();
        console.log("responseSnippet: ", responseSnippet);
        setSnippet(responseSnippet);
      } catch (e) {
        toast.error("Error fetching snippet: ", e);
      }
      // return querySnapshot.docs[0].data();
    }
    if (id) {
      getSnippet(id);
    } else {
      console.log("No id found in the url");
    }
  }, [id]);

  async function handleSave(snippetid) {
    try {
      let updatedCode = editorRef.current.getValue();
      await updateDoc(doc(db, "snippets", snippetid), { code: updatedCode });
      toast.success("update was successful!");
    } catch (e) {
      console.log("update failed with an error : ", e);
      toast.error("Update failed with error");
    }
  }

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <div className="snipContainer">
      <div className="snippet-header">
        {/* <div>
          <h1>Title : {snippet.title}</h1>
          <p>Description : {snippet.description}</p>
          <p>Language : {snippet.language}</p>
          <p>Author : {snippet.username}</p>
        </div> */}

        <button
          onClick={() => {
            handleSave(snippet.snippetid);
          }}
        >
          save
        </button>
      </div>
      {snippet.code ? ( // Only render Editor if snippet.code is available
        <Editor
          theme="vs-dark"
          language={snippet.language || "javascript"}
          height="100vh"
          width="100%"
          options={myOptions}
          // onChange={handleChange}
          onMount={handleEditorDidMount}
          defaultValue={snippet.code == "" ? "//Write your code here" : snippet.code}
        />
      ) : (
        <p>Please wait while editor is loading</p>
      )}
    </div>
  );
}

export default YourSnippets;
