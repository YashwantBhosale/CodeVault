const express = require("express");
const {
  loginWithUsername,
  loginWithEmail,
  signupUser,
  checkUser,
  getPublicSnippets,
  getSnippets,
} = require("../controllers/usercontroller");

const router = express.Router();

router.post("/loginwithemail", loginWithEmail);
router.post("/loginwithusername", loginWithUsername);

router.post("/signup", signupUser);
router.post("/checkuser", checkUser);

router.post("/getpublicsnippets", getPublicSnippets);
router.post("/getsnippets", getSnippets);


module.exports = router;