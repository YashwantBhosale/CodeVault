const express = require('express');
const router = express.Router();
const { getPublicPosts } = require('../controllers/publiccontroller');

router.get("/getpublicposts", getPublicPosts);

module.exports = router;