const express = require("express");
const {
  getComments,
  addComment,
  updateCommentDownvotes,
  updateCommentUpvotes,
} = require("../controllers/commentcontroller");

const router = express.Router();

router.get("/getcomments", getComments);
router.post("/addcomment", addComment);
router.post("/upvote", updateCommentUpvotes);
router.post("/downvote", updateCommentDownvotes);


module.exports = router;
