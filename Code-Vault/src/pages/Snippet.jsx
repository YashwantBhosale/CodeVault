import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import CodeMirror from "@uiw/react-codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { githubDark } from "@uiw/codemirror-themes-all";
import { FaCog, FaEdit } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";

export const Snippet = () => {
  const [searchParams] = useSearchParams();
  const [snippet, setSnippet] = useState({});
  const [code, setCode] = useState("// Write your code here..");
  const [showSettings, setShowSettings] = useState(false);
  const [editField, setEditField] = useState("");
  const { user } = useAuthContext();

  const id = searchParams.get("id");
  const state = EditorState.create({
    doc: "my source code",
    extensions: [githubDark, javascript({ jsx: true })],
  });

  async function fetchSnippet(id) {
    try {
      const res = await fetch("http://localhost:4000/api/user/getsnippet", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email, snippetId: id }),
      });
      const data = await res.json();
      if(data) {
        setSnippet(data);
        setCode(data.code);
      }
    } catch (e) {
      console.log("Error fetching snippet!!", e.message);
      toast.error("Error fetching snippet!!");
    }
  }

  useEffect(() => {
    if (user && id) {
      fetchSnippet(id);
    } else {
      console.log("Error fetching snippet! NO such id!");
      toast.error("No such snippet!!");
    }
  }, [user, id]);

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
    setEditField("");
  };

  const handleEditField = (fieldName) => {
    setEditField(fieldName);
    setShowSettings(true); 
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        backgroundImage:
          "radial-gradient(#000 1px, transparent 1px), radial-gradient(#000 1px, #fff 1px)",
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 20px 20px",
        height: "100vh",
      }}
    >
      <article className="mt-28 mx-auto max-w-3xl px-4">
        <div
          className="rounded-lg shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] p-4"
          style={{ backgroundColor: "#fff" }}
        >
          <div className="flex items-center justify-between mb-2">
            {showSettings ? (
              <div>
                <label className="flex items-center">
                  <span className="font-semibold mr-[5px]">Title: </span>
                  {snippet.title}
                  <FaEdit
                    className="ml-2 cursor-pointer"
                    onClick={() => handleEditField("title")}
                  />
                </label>{" "}
                {editField === "title" && (
                  <input
                    type="text"
                    value={snippet.title || ""}
                    className="border border-gray-300 px-2 py-1 rounded-md"
                    onChange={(e) =>
                      setSnippet((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            ) : (
              <h1 className="text-3xl font-semibold">
                {snippet?.title?.toUpperCase() || "N/A"}
              </h1>
            )}
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={handleSettingsToggle}
            >
              <FaCog className="w-6 h-6" />
            </button>
          </div>
          {showSettings && (
            <div className="mb-4">
              <div className="mb-2">
                <label className="flex items-center">
                  <span className="font-semibold mr-[5px]">Description: </span>
                  {snippet.description}
                  <FaEdit
                    className="ml-2 cursor-pointer"
                    onClick={() => handleEditField("description")}
                  />
                </label>{" "}
                {editField === "description" && (
                  <input
                    type="text"
                    value={snippet.description || ""}
                    className="border border-gray-300 px-2 py-1 rounded-md ml-2"
                    onChange={(e) =>
                      setSnippet((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
              <div>
                <label className="flex items-center">
                  <span className="font-semibold mr-[5px]">Language: </span>
                  {snippet.language}
                  <FaEdit
                    className="ml-2 cursor-pointer"
                    onClick={() => handleEditField("language")}
                  />
                </label>{" "}
                {editField === "language" && (
                  <input
                    type="text"
                    value={snippet.language || ""}
                    className="border border-gray-300 px-2 py-1 rounded-md ml-2"
                    onChange={(e) =>
                      setSnippet((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            </div>
          )}
          <div style={{ height: "fit-content" }}>
            <CodeMirror
              value={code}
              width="100%"
              height="60vh"
              theme={githubDark}
              basicSetup={{ lineNumbers: true }}
              extensions={[javascript({ jsx: true })]}
              onBeforeChange={(editor, data, value) => {
                setCode(value);
              }}
            />
          </div>
        </div>
      </article>
    </div>
  );
};
