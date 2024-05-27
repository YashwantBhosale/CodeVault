const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
async function getComments(req, res) {
  try {
    const postId = req.query.postId;
    const comments = await Comment.find({ post: postId });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
}

async function addComment(req, res) {
  try {
    const { postId, content, username, avtar } = req.body;
    const post = await Post.find({ _id: postId});
    
    console.log(post);
    const newComment = new Comment({
      author: {
        username,
        avtar
      },
      content,
      post: postId,
    });
    const savedComment = await newComment.save();
    console.log(post[0]);
    console.log(post[0].comments);
    post[0].comments.push(savedComment);
    await post[0].save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
}

async function updateCommentUpvotes(req, res) {
  try {
      const { id, userObj } = req.body;
      const comment = await Comment.findById(id);
      console.log("comment", comment);
      if (!comment) {
          return res.status(404).json({ error: "Comment not found" });
      }
      console.log(comment.upvotes)
      if (comment.upvotes.some((vote) => vote.username == userObj.username)) {
          return res.status(400).json({ error: "User already upvoted this comment" });
      }

      if(comment.downvotes.some((vote) => vote.username == userObj.username)){
        comment.downvotes = comment.downvotes.filter((obj) => obj.username !== userObj.username);
      }
      comment.upvotes.push(userObj);
      await comment.save();
      res.status(200).json(comment);
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to update upvotes for the comment" });
  }
}

async function updateCommentDownvotes(req, res) {
  try {
      const { id, userObj } = req.body;
      const comment = await Comment.findById(id);
      if (!comment) {
          return res.status(404).json({ error: "Comment not found" });
      }
      if (comment.downvotes.some((vote) => vote.username == userObj.username)) {
          return res.status(400).json({ error: "User already downvoted this comment" });
      }
      if(comment.upvotes.some((vote) => vote.username == userObj.username)){
        comment.upvotes = comment.upvotes.filter((obj) => obj.username !== userObj.username);
      }
      comment.downvotes.push(userObj);
      await comment.save();
      res.status(200).json(comment);
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to update downvotes for the comment" });
  }
}


module.exports = {
  getComments,
  addComment,
  updateCommentDownvotes,
  updateCommentUpvotes
};
