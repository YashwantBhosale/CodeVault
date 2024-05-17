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
  logout
} = require("../controllers/usercontroller");
const passport = require("passport");
const router = express.Router();


router.get("/google", googleAuthenticate);
router.get("/google/redirect", googleRedirect);

router.get("/github", githubAuthenticate);
router.get("/github/redirect", githubRedirect);

router.get("/login/success", loginSuccess);
router.post("/logout", logout);

router.post("/loginwithemail", loginWithEmail);
router.post("/loginwithusername", loginWithUsername);

router.post("/signup", signupUser);
router.post("/checkuser", checkUser);

router.post("/getpublicsnippets", getPublicSnippets);
router.post("/getsnippets", getSnippets);

router.post("/addsnippet", addSnippet);
router.post("/deletesnippet", deleteSnippet);

router.post("/getsnippet", getSnippet);
router.post("/updatesnippet", updateSnippet)

router.post("/createpost", createPost);

module.exports = router;