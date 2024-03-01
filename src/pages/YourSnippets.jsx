import React, {useState, useEffect} from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import snippets from "../assets/snippets";
import { db } from "../components/firebase";
import { query , collection, getDocs, where } from "firebase/firestore";
const snippetsDB = collection(db, "snippets");


function YourSnippets(){
    const [snippet, setSnippet] = useState({});
    let responseSnippet = {};

    const [ searchParams ] = useSearchParams();
    let id = searchParams.get('id');
    console.log(id);
    let myOptions = {
        fontSize: 25, 
        fontFamily: 'monospace',
    };

    
    useEffect(() => {
        async function getSnippet(id){
            try{
                let dbQuery = query(snippetsDB, where('snippetid', '==', id));
                const querySnapshot = await getDocs(dbQuery);
                responseSnippet = querySnapshot.docs[0].data();
                console.log("responseSnippet: ", responseSnippet);
                setSnippet(responseSnippet);
            }
            catch(e){
                console.error("Error fetching snippet: ", e);
            }
            // return querySnapshot.docs[0].data();   
        }
        if(id){
            getSnippet(id);
        }else{
            console.log("No id found in the url");
        }

    }, [id]);

    return(
        <div>
            <div className="snippet-header">
                <h1>{snippet.title}</h1>
                <p>{snippet.description}</p>
                <p>{snippet.language}</p>
                <p>{snippet.username}</p>
            </div>
            {snippet.code ? ( // Only render Editor if snippet.code is available
            <Editor 
                theme="vs-dark"
                language={snippet.language || "javascript"}
                height="100vh"
                width="100%"
                options={myOptions}
                defaultValue={snippet.code}
            />
        ) : <p>Please wait while editor is loading</p>}
        </div>
    )
}


export default YourSnippets;