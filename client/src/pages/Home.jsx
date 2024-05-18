import React, { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
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
const state = EditorState.create({
  doc: "my source code",
  extensions: [githubDark, javascript({ jsx: true })],
});

function Home() {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [showPopup, setShowPopup] = React.useState(false);
  const [snippetName, setSnippetName] = React.useState("");
  const [snippetLanguage, setSnippetLanguage] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [codeValue, setCodeValue] = React.useState(
    "console.log('hello world!');"
  );
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteSnippetId, setDeleteSnippetId] = useState(null);
  const [usersnippets, setUserSnippets] = React.useState([]);
  const { user } = useAuthContext();
  const [dataloading, setdataloading] = useState(false);
  const [value, setValue] = useState(null);
  const [fetched, setfetched] = useState(false);
  const [pinnedSnippets, setPinnedSnippets] = useState([]);
  const navigate = useNavigate();
  
  // Function to fetch snippets
  async function fetchsnippets(initial=false) {
    if(initial){
      setdataloading(true);
    }
    const response = await fetch("http://localhost:4000/api/user/getsnippets", {
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
    console.log("snippets: ", usersnippets);
    setdataloading(false);
  }

  useEffect(() => {
    fetchsnippets(true);
  }, []);

  // Function to toggle pin status of a snippet
  async function togglePinSnippet(snippetId, isPinned) {
    try {
      const response = await fetch(
        "http://localhost:4000/api/user/togglepinstatus",
        {
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
        }
      );
      let json = await response.json();
      if (response.ok) {
        toast.success("Snippet pin status updated!");
        fetchsnippets();
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
    setCodeValue(value);
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
      const response = await fetch(
        "http://localhost:4000/api/user/deletesnippet",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${user.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            snippetId: snippetId,
          }),
        }
      );
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
  const handleSaveButtonClick = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/user/addsnippet",
        {
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
            isPublic: true,
          }),
        }
      );
      let json = await response.json();
      console.log("response: ", json);
      if (response.ok) {
        toast.success("Snippet saved successfully!");
        fetchsnippets();
        setShowPopup(false);
      } else {
        toast.error("Error saving snippet!");
      }
    } catch (e) {
      console.error("Error saving snippet : ", e.message);
      toast.error("Error saving snippet!");
    }
  };

  // Submit function for post
  async function handlePostSubmit(e) {
    e.preventDefault();
    console.log("postTitle: ", postTitle);
    console.log("postContent: ", postContent);

    const post = {
      email: user.email,
      title: postTitle,
      content: postContent,
      author: {
        username: user.username,
        avtar: user.avtar,
      },
      isPublic: true,
      tags: ["trending"],
    };
    console.log(post);
    try {
      const response = await fetch(
        "http://localhost:4000/api/user/createPost",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${user.token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(post),
        }
      );

      if (!response.ok) {
        toast.error("Failed to create post! Please try again.");
        return;
      }

      let json = await response.json();
      console.log("response: ", json);
      toast.success("Post created successfully!");
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
            <a href="#">
              <h3 className="font-bold uppercase text-gray-900">
                {snippet.title}
              </h3>
            </a>
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
              onClick={() => togglePinSnippet(snippet._id, isPinned)}
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
      className="flex flex-col items-center mt-[15vh] md:mt-18 mb-[100px]"
      style={{
        backgroundColor: "#fff",
        backgroundImage:
          "radial-gradient(#000 1px, transparent 1px), radial-gradient(#000 1px, #fff 1px)",
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 20px 20px",
        height: "100vh",
      }}
    >
      <div className="flex w-full justify-center items-center md:items-stretch flex-col md:flex-row">
        <article className="flex bg-white transition hover:shadow-xl w-1/5 border-2 rounded-xl m-[10px] min-w-[340px]">
          <div className="flex flex-1 flex-col justify-between">
            <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
              <a href="#">
                <h3 className="font-bold uppercase text-gray-900">
                  Create a New Code Snippet
                </h3>
              </a>

              <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
                Add a code Snippet in Your favourite language
              </p>
            </div>

            <div className="sm:flex sm:items-end sm:justify-end">
              <a
                onClick={handleAddButtonClick}
                href="#"
                className="block bg-black px-5 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-slate-600 rounded-br-xl"
              >
                Add
              </a>
            </div>
          </div>
        </article>
        <article className="flex bg-white transition hover:shadow-xl w-1/5 border-2 rounded-xl m-[10px] min-w-[340px]">
          <div className="flex flex-1 flex-col justify-between">
            <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
              <a href="#">
                <h3 className="font-bold uppercase text-gray-900">
                  Create a New Post
                </h3>
              </a>

              <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
                Create a post....
              </p>
            </div>

            <div className="sm:flex sm:items-end sm:justify-end">
              <a
                onClick={handleCreatePost}
                href="#"
                className="block bg-black px-5 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-slate-600 rounded-br-xl"
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
                      <input
                        type="text"
                        id="snippetLanguage"
                        value={snippetLanguage}
                        onChange={(e) => setSnippetLanguage(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                      />
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
                      <CodeMirror
                        value={codeValue}
                        height="200px"
                        width="100%"
                        lineNumbers={false}
                        theme={githubDark}
                        basicSetup={{ lineNumbers: false }}
                        extensions={[javascript({ jsx: true })]}
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
                        <input
                          type="text"
                          id="snippetLanguage"
                          value={snippetLanguage}
                          onChange={(e) => setSnippetLanguage(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                        />
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
                    </form>
                  </motion.div>
                  <motion.div
                    initial={{ y: "100vh" }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 150 }}
                    className="bg-white p-4 rounded-xl lg:w-2/5 m-[20px] w-full"
                  >
                    <CodeMirror
                      value={codeValue}
                      height="400px"
                      width="100%"
                      lineNumbers={false}
                      theme={githubDark}
                      basicSetup={{ lineNumbers: false }}
                      extensions={[javascript({ jsx: true })]}
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
              className="bg-white rounded-xl lg:w-2/5 m-[20px]"
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
                    <label
                      for="description"
                      class="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows="4"
                      class="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write your thoughts here..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    ></textarea>
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
                    onClick={handlePostSubmit}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-slate-700"
                  >
                    Save
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
