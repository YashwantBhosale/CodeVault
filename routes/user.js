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
  createPost
} = require("../controllers/usercontroller");

const router = express.Router();

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