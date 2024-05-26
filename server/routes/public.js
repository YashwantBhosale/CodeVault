const express = require("express");
const router = express.Router();
const {
  getPublicPosts,
  updateUpvotes,
  updateDownvotes,
  addComment,
  getPostById,
  getPublicInfo,
  getAllUsers,
  getMostFollowedUsers,
  handleFiles,
  deletePostById,
  getMostFavouritedSnippets
} = require("../controllers/publiccontroller");

router.get("/getpublicposts", getPublicPosts);
router.post("/updateupvotes", updateUpvotes);
router.post("/updatedownvotes", updateDownvotes);

router.post("/addcomment", addComment);
router.get("/post", getPostById);
router.post("/delete", deletePostById);
router.get("/viewuser", getPublicInfo);

router.get("/getallusers", getAllUsers);
router.get("/mostfollowed", getMostFollowedUsers);
router.get("/mostFavourited", getMostFavouritedSnippets);

router.get("/files", handleFiles);

module.exports = router;
