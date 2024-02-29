import React from "react";
import { useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import snippets from "../assets/snippets";
function YourSnippets(){
    const { id } = useParams();
    console.log(id, typeof id);
    let actualId = Number.parseInt(id.slice(1));
    let myOptions = {
        fontSize: 25, 
        fontFamily: 'monospace',
    };
    return(
        <div>
            <Editor 
                theme="vs-dark"
                language={snippets[actualId].language}
                height="100vh"
                width="100%"
                options={myOptions}
                defaultValue={snippets[actualId].code}
            />
        </div>
    )
}


export default YourSnippets;