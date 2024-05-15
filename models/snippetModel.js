const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        default: "// Enter your code here."
    },
    language: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    tags: {
        type: Array,
        default: [],
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    DataModified: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Snippet", snippetSchema);