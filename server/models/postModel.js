const mongoose = require("mongoose");

// Post Schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  upvotes: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: {
        type: String,
      },
    },
  ],
  downvotes: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: {
        type: String,
      },
      avtar: {
        type: String,
      },
    },
  ],
  comments: {
    type: Array,
    default: [],
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
    },
    avtar: {
      type: String,
      default: "user",
    },
  },
  tags: {
    type: Array,
    default: [],
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  files: {
    type: Array,
    default: [],
  },
});

postSchema.statics.getPublicPosts = async function (page) {
  const skip = (page - 1) * 10;
  const posts = await this.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(10);
  return posts;
};

postSchema.statics.updateUpvotes = async function (id, userObj) {
  const post = await this.findById(id);
  if (!post) throw new Error("Post not found!");

  if (post.upvotes.some((obj) => obj.username === userObj.username))
    throw new Error("Already upvoted post!");

  if (post.downvotes.some((obj) => obj.username === userObj.username)) {
    post.downvotes = post.downvotes.filter(
      (obj) => obj.username !== userObj.username
    );
  }

  post.upvotes.push(userObj);
  await post.save();
};

postSchema.statics.updateDownvotes = async function (id, userObj) {
  const post = await this.findById(id);
  if (!post) throw new Error("Post not found!");

  if (post.downvotes.some((obj) => obj.username == userObj.username))
    throw new Error("Already downvoted post!");

  if (post.upvotes.some((obj) => obj.username == userObj.username)) {
    post.upvotes = post.upvotes.filter(
      (obj) => obj.username !== userObj.username
    );
  }

  post.downvotes.push(userObj);
  await post.save();
};

postSchema.statics.addComment = async function (id, author, content) {
  const post = await this.findById(id);
  if (!post) throw new Error("Post not found!");

  const comment = await mongoose
    .model("Comment")
    .create({ author, content, post: id });
  post.comments.push(comment);
  await post.save();
  return comment;
};

module.exports = mongoose.model("Post", postSchema);
