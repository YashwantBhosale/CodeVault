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
// firebase imports
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext.js";

const state = EditorState.create({
  doc: "my source code",
  extensions: [githubDark, javascript({ jsx: true })],
});

function Home() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = React.useState(false);
  const [snippetName, setSnippetName] = React.useState("");
  const [snippetLanguage, setSnippetLanguage] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [codeValue, setCodeValue] = React.useState(
    "console.log('hello world!');"
  );
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteSnippetId, setDeleteSnippetId] = useState(null);
  const [usersnippets, setUserSnippets] = React.useState([]);

  const { user } = useAuthContext();
  // firebase hooks
  const [userdocref, setuserdocref] = useState(null);
  const [dataloading, setdataloading] = useState(false);
  const [value, setValue] = useState(null);
  const [fetched, setfetched] = useState(false);
  // const [value, dataloading, dataerror] = useDocument(userdocref);

  async function fetchsnippets() {
    setdataloading(true);
    console.log(user);
    const response = await fetch("http://localhost:4000/api/user/getsnippets", {
      method: "POST",
      headers: {
        authorization: `Bearer ${user.token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email,
      })
    });
    console.log(response);
    // let json = await response.json();
    // console.log(json.snippets);
    setdataloading(false);
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
  async function deleteSnippet(snippetId) {}

  // function to save snippet
  const handleSaveButtonClick = async () => {};

  // Submit function for post
  async function handlePostSubmit(e) {}

 

  // function to display snippets
  function displaySnippets(snippet) {
    let date = null;
    if (snippet.dateCreated) {
      date = toDateTime(snippet.dateCreated.seconds);
    }
    return (
      <article
        key={snippet.id}
        className="flex bg-white transition hover:shadow-xl w-[29%] border-2 rounded-xl m-[20px] min-w-[340px]"
      >
        <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
          <time
            datetime={snippet.dateCreated}
            className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
          >
            {/* <span>{snippet.dateCreated}</span> */}
            <span className="w-px flex-1 bg-gray-900/10"></span>
            <span>
              {getMonthAndDayFromSeconds(snippet.dateCreated.seconds)}
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
              {snippet.description || "N/A"}
            </p>
            <p>
              <span className="font-bold text-gray-900">Language:</span>{" "}
              {snippet.language}
            </p>
          </div>
          <div className="flex items-end justify-end">
            <button
              onClick={() => {
                navigate(`/snippets?id=${snippet.id}`);
              }}
              className="block bg-black px-5 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-slate-600 rounded-br-xl"
            >
              Open
            </button>
            <button
              onClick={() => handleDeleteButtonClick(snippet.id)}
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
      className="flex flex-col items-center justify-center sm:justify-start mt-20 md:mt-10 mb-[100px]"
      style={{
        backgroundColor: "#fff",
        backgroundImage:
          "radial-gradient(#000 1px, transparent 1px), radial-gradient(#000 1px, #fff 1px)",
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 20px 20px",
        height: "100vh",
      }}
    >
      <article className="mt-[90px] flex bg-white transition hover:shadow-xl w-1/5 border-2 rounded-xl m-[10px] min-w-[340px]">
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
      <div className="mb-[15px] flex flex-wrap items-center justify-center sm:justify-start">
        {user && !dataloading ? (
          usersnippets.map(displaySnippets)
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
                        className="bg-black text-white px-4 py-2 rounded-md"
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
    </div>
  );
}

export default Home;
