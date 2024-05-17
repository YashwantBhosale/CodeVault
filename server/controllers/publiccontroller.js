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

async function updateUpvotes(req, res) {
    try {
        const { id, userObj } = req.body;
        console.log("id, userObj: ", id, userObj)
        const post = await Post.updateUpvotes(id, userObj);
        res.status(200).json(post);
    }catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
}

async function updateDownvotes(req, res) {
    try {
        const { id, userObj } = req.body;
        console.log("id, userObj: ", id, userObj);
        const post = await Post.updateDownvotes(id, userObj);
        res.status(200).json(post);
    }catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getPublicPosts,
    updateUpvotes,
    updateDownvotes,
};