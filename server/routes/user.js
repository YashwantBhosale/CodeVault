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
  followUser,
  unfollowUser,
  getnotifications,
  uploadFiles,
  updateReadStatus,
  clearNotifications,
  inviteUser,
  removeFollower,
  toggleFavouriteSnippet,
  getFavouriteSnippets,
  validateJWT
} = require("../controllers/usercontroller");
const multer = require("multer");
const upload = multer();
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
router.post("/addsnippet", verifyjwt, addSnippet);
router.post("/deletesnippet", verifyjwt, deleteSnippet);

router.post("/follow", followUser);
router.post("/unfollow", unfollowUser);
router.post("/removefollower", removeFollower);

router.post("/getsnippet", verifyjwt, getSnippet);
router.post("/updatesnippet", verifyjwt, updateSnippet);
router.post("/togglepinstatus", verifyjwt, togglePinStatus);
// Routes for creating post
router.post("/uploadfile", upload.array("files", 5), uploadFiles);
router.post("/createpost", verifyjwt, createPost);

router.post("/getnotifications", getnotifications);
router.post("/readnotifications", updateReadStatus);
router.post("/clearnotifications", clearNotifications);

router.post("/handleFavouriteSnippet", toggleFavouriteSnippet);
router.post("/getfavouritesnippets", getFavouriteSnippets);

router.post("/invite", inviteUser);
router.post("/verifyjwt", validateJWT);
module.exports = router;
