const express = require("express");
const router = express.Router();
const {
  getPublicPosts,
  updateUpvotes,
  updateDownvotes,
  addComment,
  getPostById,
} = require("../controllers/publiccontroller");

router.get("/getpublicposts", getPublicPosts);
router.post("/updateupvotes", updateUpvotes);
router.post("/updatedownvotes", updateDownvotes);

router.post("/addcomment", addComment);
router.get("/post", getPostById);

module.exports = router;
