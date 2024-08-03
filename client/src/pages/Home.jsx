import React, { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorState } from "@codemirror/state";
import { githubDark } from "@uiw/codemirror-themes-all";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import generateUniqueId from "generate-unique-id";
import DeleteConfirmation from "../components/DeleteConfirmation";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { MultiSelect } from "react-multi-select-component";

import axios from "axios";

import {
  languages,
  languageExtensions,
  placeholders,
} from "../utils/languages.js";

const state = EditorState.create({
  doc: "my source code",
  extensions: [githubDark],
});

function Home() {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [showPopup, setShowPopup] = React.useState(false);
  const [snippetName, setSnippetName] = React.useState("");
  const [snippetLanguage, setSnippetLanguage] = React.useState("javascript");
  const [description, setDescription] = React.useState("");
  const [codeValue, setCodeValue] = React.useState(
    placeholders[snippetLanguage]
  );
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteSnippetId, setDeleteSnippetId] = useState(null);
  const [usersnippets, setUserSnippets] = React.useState([]);
  const { user, dispatch, userLoading } = useAuthContext();
  const [dataloading, setdataloading] = useState(false);
  const [value, setValue] = useState(null);
  const [fetched, setfetched] = useState(false);
  let [pinnedSnippets, setPinnedSnippets] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [visibility, setVisibility] = useState("public");
  const [postVisibility, setPostVisibility] = useState("public");
  const [selectedPostTags, setSelectedPostTags] = useState([]);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const options = [
    { label: "trending", value: "trending" },
    { label: "new", value: "new" },
    { label: "popular", value: "popular" },
    { label: "top", value: "top" },
    { label: "non-tech", value: "non-tech" },
  ];

  const handleLanguageSelect = (language) => {
    setSnippetLanguage(language);
    setCodeValue(placeholders[language]);
    setDropdownOpen(false);
  };

  // Function to fetch snippets
  async function fetchsnippets(initial = false) {
    if (!user || userLoading) {
      return;
    }
    if (initial) {
      setdataloading(true);
    }
    const response = await fetch(BASE_URL + "api/user/getsnippets", {
      method: "POST",
      headers: {
        authorization: `Bearer ${user.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
      }),
    });
    let json = await response.json();
    const pinned = json.filter((snippet) => snippet.isPinned);
    const unpinned = json.filter((snippet) => !snippet.isPinned);

    setPinnedSnippets(pinned);
    setUserSnippets(unpinned);
    // console.log("snippets: ", usersnippets);
    setdataloading(false);
  }

  useEffect(() => {
    if (user && !userLoading) {
      fetchsnippets(true);
    }
  }, [user, userLoading]);

  // Function to toggle pin status of a snippet
  async function togglePinSnippet(snippet, snippetId, isPinned) {
    try {
      if (!isPinned) {
        setPinnedSnippets([...pinnedSnippets, snippet]);
        setUserSnippets(usersnippets.filter((s) => s._id !== snippetId));
      } else {
        setPinnedSnippets(pinnedSnippets.filter((s) => s._id !== snippetId));
        setUserSnippets([...usersnippets, snippet]);
      }

      const response = await fetch(BASE_URL + "api/user/togglepinstatus", {
        method: "POST",
        headers: {
          authorization: `Bearer ${user.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          snippetId: snippetId,
          isPinned: !isPinned,
        }),
      });
      let json = await response.json();
      if (response.ok) {
        toast.success("Snippet pin status updated!");
      } else {
        toast.error("Error updating snippet pin status!");
      }
    } catch (e) {
      console.error("Error updating snippet pin status : ", e.message);
      toast.error("Error updating snippet pin status!");
    }
  }

  // state handlers
  const handleAddButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleDeleteButtonClick = (snippetId) => {
    setDeleteSnippetId(snippetId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmation = () => {
    deleteSnippet(deleteSnippetId);
    setShowDeleteConfirmation(false);
  };

  const handleChange = (value, viewUpdate) => {
    console.log("value: ", value);
    setCodeValue(value);
    console.log("codeValue: ", codeValue);
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  // Utitlity functions
  function getMonthFromIndex(index) {
    switch (index) {
      case 0:
        return "Jan";
      case 1:
        return "Feb";
      case 2:
        return "Mar";
      case 3:
        return "Apr";
      case 4:
        return "May";
      case 5:
        return "Jun";
      case 6:
        return "Jul";
      case 7:
        return "Aug";
      case 8:
        return "Sep";
      case 9:
        return "Oct";
      case 10:
        return "Nov";
      case 11:
        return "Dec";
      default:
        return "Invalid month index";
    }
  }

  // Get date from seconds
  function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
  }

  useEffect(() => {
    fetchsnippets();
  }, []);

  function getMonthAndDayFromSeconds(seconds) {
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var milliseconds = seconds * 1000;
    var date = new Date(milliseconds);
    var monthIndex = date.getMonth();
    var monthName = months[monthIndex];
    var day = date.getDate();

    return monthName + " " + day;
  }

  // Main functions
  // Function to delete a snippet
  async function deleteSnippet(snippetId) {
    try {
      const response = await fetch(BASE_URL + "api/user/deletesnippet", {
        method: "POST",
        headers: {
          authorization: `Bearer ${user.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          snippetId: snippetId,
        }),
      });
      let json = await response.json();
      console.log("response: ", json);
      if (response.ok) {
        toast.success("Snippet deleted successfully!");
        fetchsnippets();
      } else {
        toast.error("Error deleting snippet!");
      }
    } catch (e) {
      console.error("Error deleting snippet : ", e.message);
      toast.error("Error deleting snippet!");
    }
  }

  // function to save snippet
  const handleSaveButtonClick = async (e) => {
    try {
      console.log("snippet", codeValue);
      const response = await fetch(BASE_URL + "api/user/addsnippet", {
        method: "POST",
        headers: {
          authorization: `Bearer ${user.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          title: snippetName,
          code: codeValue,
          language: snippetLanguage,
          description: description,
          tags: ["trending"],
          isPublic: visibility === "public" ? true : false,
        }),
      });
      let json = await response.json();
      console.log("response: ", json);
      if (response.ok) {
        toast.success("Snippet saved successfully!");
        fetchsnippets();
        setShowPopup(false);
        setSnippetName("");
        setSnippetLanguage("javascript");
        setDescription("");
      } else {
        toast.error("Error saving snippet!");
      }
    } catch (e) {
      console.error("Error saving snippet : ", e.message);
      toast.error("Error saving snippet!");
    }
  };

  function getExtensionFromFileType(fileType) {
    const fileTypes = {
      "image/png": "png",
      "image/jpeg": "jpeg",
      "image/jpg": "jpg",
      "image/webp": "webp",
    };
    return fileTypes[fileType];
  }

  async function handleFileUpload(files, author, post, extensions) {
    setFileUploadLoading(true);
    // const extension = getExtensionFromFileType(file.type);
    // if (!extension) {
    //   toast.error("Invalid file type! You can only upload images!");
    //   return;
    // }
    // const filename = `${user.username}-${post.title}.${extension}`;
    const formData = new FormData();
    // formData.append("files", files);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("extensions", JSON.stringify(extensions));
    // formData.append("filename", filename);
    formData.append("author", author.username);
    formData.append("post", post.title);
    console.log("formdata : ", formData);

    const response = await fetch(BASE_URL + "api/user/uploadfile", {
      method: "POST",
      headers: {
        authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });
    console.log(response);
    if (response.ok) {
      toast.success("File uploaded successfully!");
      return true;
    } else {
      toast.error("Error uploading file!");
      return false;
    }
    setFileUploadLoading(false);
  }

  // Submit function for post
  async function handlePostSubmit(e) {
    e.preventDefault();
    console.log("postTitle: ", postTitle);
    const result = postContent.replace(/(\r\n|\r|\n)/g, "<br>");
    console.log("postContent: ", result);

    let tags = selectedPostTags.map((tag) => tag.value);
    console.log("tags: ", tags);
    const post = {
      email: user.email,
      title: postTitle,
      content: result,
      author: {
        username: user.username,
        avtar: user.avtar,
      },
      isPublic: postVisibility === "public" ? true : false,
      tags: tags,
      files: [],
    };
    console.log(post);

    if (files.length) {
      const userObj = {
        username: user.username,
        email: user.email,
        avtar: user.avtar,
      };
      const postObj = {
        title: postTitle,
        author: user.username,
      };
      let extensions = [];
      for (let i = 0; i < files.length; i++) {
        extensions.push(getExtensionFromFileType(files[i].type));
      }
      let res = await handleFileUpload(files, userObj, postObj, extensions);
      if (res) {
        for (let i = 0; i < files.length; i++) {
          let extension = getExtensionFromFileType(files[i].type);
          post.files.push(`${user.username}-${postTitle}-${i}.${extension}`);
        }
      }
    }

    try {
      const response = await fetch(BASE_URL + "api/user/createPost", {
        method: "POST",
        headers: {
          authorization: `Bearer ${user.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        toast.error("Failed to create post! Please try again.");
        return;
      }

      let json = await response.json();
      let stored_posts = JSON.parse(sessionStorage.getItem("posts"));
      console.log("stored_posts: ", stored_posts);
      if (stored_posts != null) {
        sessionStorage.setItem(
          "posts",
          JSON.stringify([json, ...stored_posts])
        );
      }
      dispatch({ type: "ADD_POSTS", payload: json });
      toast.success("Post created successfully!");
      setShowCreatePost(false);
    } catch (err) {
      console.log("error adding post: ", err.message);
      toast.error("Error creating post!");
    }
  }

  // function to display snippets
  function truncateDescription(description, maxLength) {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + "...";
    }
    return description;
  }

  function displaySnippets(snippet, isPinned = false) {
    const month = getMonthFromIndex(
      Number.parseInt(snippet.dateCreated.split("-")[1]) - 1
    );
    const day = snippet.dateCreated.split("-")[2].split("T")[0];
    const date = `${month} ${day}`;

    return (
      <article
        key={snippet._id}
        className="flex bg-white transition hover:shadow-xl w-[29%] border-2 rounded-xl m-[20px] min-w-[340px]"
      >
        {isPinned && (
          <FontAwesomeIcon
            icon={faThumbtack}
            className="text-yellow-500 text-xl ml-2 mt-2"
          />
        )}
        <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
          <time
            // dateTime={date}
            className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
          >
            <span>{date}</span>
            <span className="w-px flex-1 bg-gray-900/10"></span>
            <span>
              {/* {getMonthAndDayFromSeconds(snippet.dateCreated.seconds)} */}
            </span>
          </time>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6 min-h-[150px]">
              <h3 className="font-bold uppercase text-gray-900">
                {snippet.title}
              </h3>
            <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
              <span className="font-bold text-gray-900">Description:</span>{" "}
              {truncateDescription(snippet.description || "N/A", 17)}
            </p>
            <p>
              <span className="font-bold text-gray-900">Language:</span>{" "}
              {snippet.language}
            </p>
          </div>
          <div className="flex items-end justify-end">
            <button
              className="block min-w-[6vw] bg-black px-5 py-3 text-center mr-2 text-xs font-bold uppercase text-white transition hover:bg-slate-600 rounded-bl-xl"
              onClick={() => togglePinSnippet(snippet, snippet._id, isPinned)}
            >
              {isPinned ? "Unpin" : "Pin"}
            </button>
            <button
              onClick={() => {
                navigate(`/snippets?id=${snippet._id}`);
              }}
              className="block bg-black px-5 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-slate-600 "
            >
              Open
            </button>
            <button
              onClick={() => handleDeleteButtonClick(snippet._id)}
              className="block bg-red-500 px-5 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-red-600 rounded-br-xl mt-2 ml-2"
            >
              Delete
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div
      className="flex flex-col h-screen items-center mt-[13vh] md:mt-18 pb-[10vh]"
      style={{
        backgroundColor: "#fff",
        backgroundImage:
          "radial-gradient(#000 1px, transparent 1px), radial-gradient(#000 1px, #fff 1px)",
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 20px 20px",
        // height: "100vh",
        marginBottom: "10vh",
      }}
    >
      <div className="flex w-full justify-center items-center md:items-stretch flex-col md:flex-row">
        <article className="flex bg-white transition hover:shadow-xl w-1/5 border-2 rounded-xl m-[10px] min-w-[340px]">
          <div className="flex flex-1 flex-col justify-between">
            <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
                <h3 className="font-bold uppercase text-gray-900">
                  Create a New Code Snippet
                </h3>

              <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
                Add a code Snippet in Your favourite language
              </p>
            </div>

            <div className="sm:flex sm:items-end sm:justify-end">
              <a
                onClick={handleAddButtonClick}
                href="#"
                className="block bg-black px-5 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-slate-600 rounded-b-xl md:rounded-br-xl md:rounded-bl-none"
              >
                Add
              </a>
            </div>
          </div>
        </article>
        <article className="flex bg-white transition hover:shadow-xl w-1/5 border-2 rounded-xl m-[10px] min-w-[340px]">
          <div className="flex flex-1 flex-col justify-between">
            <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
                <h3 className="font-bold uppercase text-gray-900">
                  Create a New Post
                </h3>

              <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
                Create a post....
              </p>
            </div>

            <div className="sm:flex sm:items-end sm:justify-end">
              <a
                onClick={handleCreatePost}
                href="#"
                className="block bg-black px-5 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-slate-600 rounded-b-xl md:rounded-br-xl md:rounded-bl-none"
              >
                Create
              </a>
            </div>
          </div>
        </article>
      </div>
      <div className="mb-[15px] flex flex-wrap items-center justify-center ">
        {user && !dataloading ? (
          <>
            {pinnedSnippets.map((snippet) => displaySnippets(snippet, true))}
            {usersnippets.map((snippet) => displaySnippets(snippet))}
          </>
        ) : (
          <SyncLoader />
        )}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-50"
            >
              {window.innerWidth <= 768 ? (
                <motion.div
                  initial={{ y: "-100vh" }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 150 }}
                  className="bg-white p-8 rounded-xl w-full m-[20px]"
                >
                  <h2 className="text-xl font-bold mb-4">Add New Snippet</h2>
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="snippetName"
                        className="block font-medium"
                      >
                        Snippet Name
                      </label>
                      <input
                        type="text"
                        id="snippetName"
                        value={snippetName}
                        onChange={(e) => setSnippetName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="snippetLanguage"
                        className="block font-medium"
                      >
                        Snippet Language
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="snippetLanguage"
                          value={
                            languages.find(
                              (lang) => lang.id === snippetLanguage
                            )?.name || ""
                          }
                          onFocus={() => setDropdownOpen(true)}
                          readOnly
                          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 cursor-pointer"
                        />
                        {dropdownOpen && (
                          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                            {languages.map((language) => (
                              <li
                                key={language.id}
                                onClick={() =>
                                  handleLanguageSelect(language.id)
                                }
                                className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                              >
                                {language.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block font-medium"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 resize-none"
                        rows="3"
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="visibility">Visibility: </label>
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked
                        className="mx-2"
                        onChange={(e) => setVisibility(e.target.value)}
                      />{" "}
                      Public
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        className="mx-2"
                        onChange={(e) => setVisibility(e.target.value)}
                      />{" "}
                      Private
                    </div>
                    <div>
                      <CodeMirror
                        value={
                          placeholders[snippetLanguage] ||
                          "Write your code here..."
                        }
                        height="200px"
                        width="100%"
                        lineNumbers={false}
                        theme={githubDark}
                        basicSetup={{ lineNumbers: false }}
                        extensions={languageExtensions[snippetLanguage]}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleClosePopup}
                        className="bg-gray-300 px-4 py-2 rounded-md mr-4"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveButtonClick}
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-slate-700"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    initial={{ y: "-100vh" }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 150 }}
                    className="bg-white p-8 rounded-xl lg:w-2/5 m-[20px]"
                  >
                    <h2 className="text-xl font-bold mb-4">Add New Snippet</h2>
                    <form className="space-y-4">
                      <div>
                        <label
                          htmlFor="snippetName"
                          className="block font-medium"
                        >
                          Snippet Name
                        </label>
                        <input
                          type="text"
                          id="snippetName"
                          value={snippetName}
                          onChange={(e) => setSnippetName(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="snippetLanguage"
                          className="block font-medium"
                        >
                          Snippet Language
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="snippetLanguage"
                            value={
                              languages.find(
                                (lang) => lang.id === snippetLanguage
                              )?.name || ""
                            }
                            onFocus={() => setDropdownOpen(true)}
                            readOnly
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 cursor-pointer"
                          />
                          {dropdownOpen && (
                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                              {languages.map((language) => (
                                <li
                                  key={language.id}
                                  onClick={() =>
                                    handleLanguageSelect(language.id)
                                  }
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                                >
                                  {language.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="description"
                          className="block font-medium"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 resize-none"
                          rows="3"
                        ></textarea>
                      </div>
                      <div>
                        <label htmlFor="visibility">Visibility: </label>
                        <input
                          type="radio"
                          name="visibility"
                          value="public"
                          checked
                          className="mx-2"
                          onChange={(e) => setVisibility(e.target.value)}
                        />{" "}
                        Public
                        <input
                          type="radio"
                          name="visibility"
                          value="private"
                          className="mx-2"
                          onChange={(e) => setVisibility(e.target.value)}
                        />{" "}
                        Private
                      </div>
                    </form>
                  </motion.div>
                  <motion.div
                    initial={{ y: "100vh" }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 150 }}
                    className="bg-white p-4 rounded-xl lg:w-2/5 m-[20px] w-full"
                  >
                    <CodeMirror
                      value={
                        placeholders[snippetLanguage] ||
                        "Write your code here..."
                      }
                      height="400px"
                      width="100%"
                      lineNumbers={false}
                      theme={githubDark}
                      basicSetup={{ lineNumbers: false }}
                      extensions={languageExtensions[snippetLanguage]}
                      onChange={handleChange}
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleClosePopup}
                        className="bg-gray-300 px-4 py-2 rounded-md mr-4"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveButtonClick}
                        className="bg-black text-white px-4 py-2 rounded-md"
                      >
                        Save
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <DeleteConfirmation
          type="snippet"
          isOpen={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onDelete={handleDeleteConfirmation}
        />
      </div>
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-50"
          >
            <motion.div
              initial={{ y: "-100vh" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="bg-white rounded-xl w-[90%] lg:w-2/5 m-[20px]"
            >
              <div className="bg-white p-2 rounded-xl w-4/5 m-[20px]">
                <h2 className="text-xl font-bold mb-4">Create New Post</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="snippetName" className="block font-medium">
                      Post title
                    </label>
                    <input
                      type="text"
                      id="snippetName"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <label>Tags:</label>
                    <MultiSelect
                      options={options}
                      value={selectedPostTags}
                      onChange={(value) => {
                        setSelectedPostTags(value);
                      }}
                      labelledBy="Select"
                    />
                  </div>
                  <div>
                    <label
                      for="description"
                      class="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      style={{ whiteSpace: "pre-wrap" }}
                      rows="4"
                      className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write your thoughts here..."
                      value={postContent}
                      onChange={(e) => {
                        setPostContent(e.target.value);
                        console.log(postContent);
                      }}
                    ></textarea>
                  </div>

                  <div>
                    <label>Images:</label>
                    <input
                      multiple
                      type="file"
                      onChange={(e) => {
                        setFiles(e.target.files);
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="postvisibility">Visibility: </label>
                    <input
                      type="radio"
                      name="postvisibility"
                      value="public"
                      checked
                      className="mx-2"
                      onChange={(e) => setPostVisibility(e.target.value)}
                    />{" "}
                    Public
                    <input
                      type="radio"
                      name="postvisibility"
                      value="private"
                      className="mx-2"
                      onChange={(e) => setPostVisibility(e.target.value)}
                    />{" "}
                    Private
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreatePost(false);
                    }}
                    className="bg-gray-300 px-4 py-2 rounded-md mr-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={fileUploadLoading}
                    onClick={handlePostSubmit}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-slate-700"
                  >
                    {fileUploadLoading ? <SyncLoader color="white"/> : "Save" }
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;