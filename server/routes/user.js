const express = require("express");
const {
  loginWithUsername,
  loginWithEmail,
  signupUser,
  checkUser,
  getPublicSnippets,
  getSnippets,
  addSnippet,
  deleteSnippet,
  getSnippet,
  updateSnippet,
  createPost,
  googleAuthenticate,
  googleRedirect,
  githubAuthenticate,
  githubRedirect,
  loginSuccess,
  logout,
  verifyjwt,
  togglePinStatus,
  generateImage
} = require("../controllers/usercontroller");
const router = express.Router();

// Routes for google authentication
router.get("/google", googleAuthenticate);
router.get("/google/redirect", googleRedirect);

// Routes for github authentication
router.get("/github", githubAuthenticate);
router.get("/github/redirect", githubRedirect);

// Routes for OAuth login/logout
router.get("/login/success", loginSuccess);
router.post("/logout", logout);

// Routes for login
router.post("/loginwithemail", loginWithEmail);
router.post("/loginwithusername", loginWithUsername);

// Routes for signup and checking user
router.post("/signup", signupUser);
router.post("/checkuser", checkUser);

// Routes for fetching snippets
router.post("/getpublicsnippets", getPublicSnippets);
router.post("/getsnippets", getSnippets);

// Routes for adding, deleting, updating snippets
router.post("/addsnippet",verifyjwt, addSnippet);
router.post("/deletesnippet",verifyjwt, deleteSnippet);

router.post("/getsnippet",verifyjwt, getSnippet);
router.post("/updatesnippet",verifyjwt, updateSnippet)
router.post("/togglepinstatus",verifyjwt, togglePinStatus);
router.post("/generateImage", generateImage);
// Routes for creating post
router.post("/createpost",verifyjwt, createPost);

module.exports = router;