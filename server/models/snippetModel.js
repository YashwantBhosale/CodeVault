const mongoose = require("mongoose");

// Snippet Schema
const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    default: "// Enter your code here.",
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
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  DataModified: {
    type: Date,
    default: Date.now,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  favourites: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: String,
      avtar: String,
    },
  ],
});

module.exports = mongoose.model("Snippet", snippetSchema);
