const express = require("express");
const router = express.Router();
const {
  getPublicPosts,
  updateUpvotes,
  updateDownvotes,
} = require("../controllers/publiccontroller");

router.get("/getpublicposts", getPublicPosts);
router.post("/updateupvotes", updateUpvotes);
router.post("/updatedownvotes", updateDownvotes);

module.exports = router;
