const User = require("../models/userModel");
const Post = require("../models/postModel");

async function getPublicPosts(req, res) {
    try {
        const posts = await Post.getPublicPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getPublicPosts,
};