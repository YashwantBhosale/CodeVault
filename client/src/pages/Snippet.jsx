import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import CodeMirror from "@uiw/react-codemirror";
import { EditorState } from "@codemirror/state";
import { githubDark } from "@uiw/codemirror-themes-all";
import { FaCog, FaEdit, FaClipboard } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  languages,
  languageExtensions,
  placeholders,
} from "../utils/languages.js";

export const Snippet = () => {
  const [searchParams] = useSearchParams();
  const [snippet, setSnippet] = useState({});
  const [code, setCode] = useState("// Write your code here..");
  const [showSettings, setShowSettings] = useState(false);
  const [editField, setEditField] = useState("");
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const id = searchParams.get("id");
  const state = EditorState.create({
    doc: "my source code",
    extensions: [githubDark],
  });

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  async function handleDownload() {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: code,
      redirect: "follow",
    };

    const supportedLanguagesForDownload = [
      "c",
      "css",
      "cpp",
      "go",
      "html",
      "java",
      "javascript",
      "jsx",
      "php",
      "python",
      "rust",
      "typescript",
    ];

    let language = supportedLanguagesForDownload.includes(snippet.language)
      ? `${snippet.language}`
      : "javascript";
    fetch(
      `https://code2img.vercel.app/api/to-image?language=${language}&theme=dracula&background-color=rgba(171,184,195,1)`,
      requestOptions
    )
      .then((response) => response.blob())
      .then((result) => URL.createObjectURL(result))
      .then((url) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = "code.png";
        a.click();
      })
      .then(() => setLoading(false))
      .then(() => toast.success("Image downloaded successfully!"))
      .then(() => setLoading(false))
      .catch((error) => console.error("error", error));
  }

  async function fetchSnippet(id) {
    try {
      const res = await fetch(BASE_URL + "api/user/getsnippet", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email, snippetId: id }),
      });
      const data = await res.json();
      if (data) {
        setSnippet(data);
        setCode(data.code);
      }
    } catch (e) {
      console.log("Error fetching snippet!!", e.message);
      toast.error("Error fetching snippet!!");
    }
  }

  async function handleSave(e) {
    console.log(code, snippet);

    const response = await fetch(BASE_URL + "api/user/updatesnippet", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        snippetId: id,
        title: snippet.title,
        code: code,
        language: snippet.language,
        description: snippet.description,
        tags: snippet.tags,
        isPublic: snippet.isPublic,
      }),
    });

    if (response.ok) {
      toast.success("Snippet saved successfully!");
    } else {
      toast.error("Error updating snippet!");
    }
  }

  useEffect(() => {
    if (user && id) {
      fetchSnippet(id);
    } else {
      console.log("Error fetching snippet! NO such id!");
      // toast.error("No such snippet!!");
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

  const handleChange = (value, viewUpdate) => {
    setCode(value);
  };

  const handleLanguageSelect = (id) => {
    setSnippet((prev) => ({ ...prev, language: id }));
    setDropdownOpen(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("Code copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy code to clipboard!");
      });
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
      <article className="mt-[13vh] mx-auto max-w-3xl px-4">
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
                  <>
                    <input
                      type="text"
                      id="snippetLanguage"
                      value={
                        snippet.language
                      }
                      onFocus={() => setDropdownOpen(true)}
                      readOnly
                      className="border border-gray-300 rounded-md px-3 py-2 mt-1 cursor-pointer"
                    />
                    {dropdownOpen && (
                      <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                        {languages.map((language) => (
                          <li
                            key={language.id}
                            onClick={() => handleLanguageSelect(language.id)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                          >
                            {language.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          <div className="relative" style={{ height: "fit-content" }}>
            <button
              className="absolute top-2 right-2 bg-gray-200 rounded p-1 hover:bg-gray-300 z-10"
              onClick={copyToClipboard}
            >
              <FaClipboard className="w-5 h-5 text-white-600" />
            </button>
            <CodeMirror
              value={code}
              width="100%"
              height="60vh"
              theme={githubDark}
              onChange={handleChange}
              basicSetup={{ lineNumbers: true }}
              extensions={languageExtensions[snippet.language]}
              onBeforeChange={(editor, data, value) => {
                setCode(value);
              }}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              className="mt-2 block bg-black px-5 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-slate-600 rounded-xl mr-2"
            >
              {loading ? (
                <div className="text-white text-center animate-pulse">
                  Downloading...
                </div>
              ) : (
                "Download Image"
              )}
            </button>
            <button
              onClick={handleSave}
              className="mt-2 block bg-black px-5 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-slate-600 rounded-xl"
            >
              Save Changes
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};
