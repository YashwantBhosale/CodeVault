const mongoose = require("mongoose");

// Comment Schema

const commentSchema = mongoose.Schema({
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
        },
    },
    content: {
        type: String,
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    upvotes: [
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
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Comment", commentSchema);