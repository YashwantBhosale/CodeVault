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
import { Likebutton } from "../components/Likebutton.jsx";

export const ViewPublicSnippet = () => {
  const [searchParams] = useSearchParams();
  const [snippet, setSnippet] = useState({});
  const [code, setCode] = useState("// Waiting for code...");
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const id = searchParams.get("snippetId");
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

  useEffect(() => {
    if (user && id) {
      fetchSnippet(id);
    } else {
      console.log("Error fetching snippet! NO such id!");
      // toast.error("No such snippet!!");
    }
  }, [user, id]);

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
            <h1 className="text-3xl font-semibold">
              {snippet?.title?.toUpperCase() || "N/A"}
            </h1>

            <Likebutton snippetId={snippet._id}/>
          </div>
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
              basicSetup={{ lineNumbers: true }}
              extensions={languageExtensions[snippet.language]}
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
          </div>
        </div>
      </article>
    </div>
  );
};
