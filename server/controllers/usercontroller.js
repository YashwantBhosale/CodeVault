const User = require("../models/userModel");
const Snippet = require("../models/snippetModel");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

// for creating token
function createToken(id) {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "1d" });
}

//for verifying token
function verifyjwt(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "unauthorised" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      res.status(400).json({ message: "Invalid token" });
    }
    req.user = decoded;
    console.log("successfully verified token!", next);
    next();
  });
}

//for Google OAuth2.0
function googleAuthenticate(req, res, next) {
  return passport.authenticate("google", {
    scope: ["email", "profile"],
  })(req, res, next);
}

function googleRedirect(req, res, next) {
  return passport.authenticate("google", {
    successRedirect: "http://localhost:3000/oauth",
    failureRedirect: "http://localhost:3000/login",
  })(req, res, next);
}

//for Github OAuth2.0
function githubAuthenticate(req, res, next) {
  return passport.authenticate("github", {
    scope: ["email", "profile"],
  })(req, res, next);
}

function githubRedirect(req, res, next) {
  return passport.authenticate("github", {
    successRedirect: "http://localhost:3000/oauth",
    failureRedirect: "http://localhost:3000/login",
  })(req, res, next);
}

//fetching user details after successful login from OAuth 2.0
function loginSuccess(req, res) {
  if (req.user) {
    res
      .json({
        success: true,
        message: "user has successfully authenticated",
        user: req.user,
        token: createToken(req.user._id),
      })
      .status(200);
  }
}

//for logout
function logout(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000/");
  });
}

//for login with username
async function loginWithUsername(req, res) {
  const { username, password } = req.body;
  console.log("username: ", username, "password: ", password);
  try {
    const user = await User.loginWithUsername(username, password);
    const token = createToken(user._id);
    const response = {
      username: user.username,
      avtar: user.avtar,
      email: user.email,
      followers: user.followers,
      following: user.following,
      token,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
}

//for login with email
async function loginWithEmail(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.loginWithEmail(email, password);
    const token = createToken(user._id);
    const response = {
      username: user.username,
      avtar: user.avtar,
      email: user.email,
      followers: user.followers,
      following: user.following,
      token,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log("error signup : ", error.message);
    res.status(400).json({ message: error.message });
  }
}

//for signup
async function signupUser(req, res) {
  const { username, email, password, avtar } = req.body;
  console.log("username: ", username, "password: ", password);
  try {
    const user = await User.signup(username, email, password, avtar);
    const token = createToken(user._id);
    const response = {
      username: user.username,
      avtar: user.avtar,
      email: user.email,
      followers: user.followers,
      following: user.following,
      token,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log("error signup : ", error.message);
    res.status(400).json({ message: error.message });
  }
}

//for checking user
async function checkUser(req, res) {
  const { email } = req.body;
  try {
    const user = await User.checkUser(email);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

//for fetching public snippets
async function getPublicSnippets(req, res) {
  const { email } = req.body;
  try {
    const publicSnippets = await User.getPublicSnippets(email);
    res.status(200).json(publicSnippets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

//for fetching snippets
async function getSnippets(req, res) {
  const { email } = req.body;
  console.log("email: ", email);

  try {
    const snippets = await User.getSnippets(email);
    res.status(200).json(snippets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

//for adding snippets
async function addSnippet(req, res) {
  const { email, title, code, language, description, tags, isPublic } =
    req.body;
  console.log("req.user.email : ", req.body.email, req.user);
  try {
    await User.addSnippet(
      email,
      title,
      code,
      language,
      description,
      tags,
      isPublic
    );
    res.status(200).json({ message: "Success!" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

//for deleting snippets
async function deleteSnippet(req, res) {
  const { email, snippetId } = req.body;

  try {
    await User.deleteSnippet(email, snippetId);
    res.status(200).json({ message: "Success!" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

//for fetching snippet with id
async function getSnippet(req, res) {
  const { email, snippetId } = req.body;
  console.log("email, id : ", email, snippetId);

  try {
    const snippet = await User.getSnippetById(email, snippetId);
    console.log("snippet ; ", snippet);
    res.status(200).json(snippet);
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
}

//for updating snippet
async function updateSnippet(req, res) {
  const {
    email,
    snippetId,
    title,
    code,
    language,
    description,
    tags,
    isPublic,
  } = req.body;
  try {
    await User.updateSnippet(
      email,
      snippetId,
      title,
      code,
      language,
      description,
      tags,
      isPublic
    );
    res.status(200).json({ message: "Success!" });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
}

//for creating post
async function createPost(req, res) {
  const { email, title, content, author, tags, isPublic, files } = req.body;
  try {
    await User.createPost(email, title, content, author, tags, isPublic, files);
    res.status(200).json({ message: "Success!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

//for toggling pin status
async function togglePinStatus(req, res) {
  const { email, snippetId, isPinned } = req.body;
  try {
    const snippet = await Snippet.findOne({ _id: snippetId });
    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }
    snippet.isPinned = isPinned;
    await snippet.save();

    res.json(snippet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//for delay
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function followUser(req, res) {
  const { email, username, followObj } = req.body;
  console.log(email, username, followObj);
  try {
    await User.follow(email, username, followObj);
    res.status(200).json({ message: "SUCCESS!" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
}

async function unfollowUser(req, res) {
  const { email, username, followObj } = req.body;
  try {
    await User.unfollow(email, username, followObj);
    res.status(200).json({ message: "SUCCESS!" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
}

async function getnotifications(req, res) {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) throw Error("User not found!");
    const result = {
      notifications: user.notifications,
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
}
/*
async function uploadFile(req, res) {
  try {
    console.log("uploadFile: ", req.body)
    const client = await mongoClient.connect(process.env.MONGO_URI);
    const db = client.db(process.env.DB_NAME);
    const bucket = new mongodb.GridFSBucket(db,{
      bucketName: 'uploads'
    });

    const fileDetails = req.body;
    console.log("fileDetails : ",  fileDetails);

    const filename = fileDetails.filename;
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        author: fileDetails.author,
        post: fileDetails.post,
        filename: filename,
      }
    });
    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', () => {
      client.close();
      res.status(200).json({ message: "File uploaded successfully!" });
    })

  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
}
*/

async function uploadFiles(req, res) {
  try {
    console.log("uploadFiles: ", req.body);
    const client = await mongoClient.connect(process.env.MONGO_URI);
    const db = client.db(process.env.DB_NAME);
    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "uploads",
    });

    const fileDetails = req.body;
    const extensions = JSON.parse(fileDetails.extensions);
    console.log("fileDetails : ", fileDetails);
    console.log("files : ", req.files);

    const promises = req.files.map((file, index) => {
      const filename = `${fileDetails.author}-${
        fileDetails.post
      }-${index}.${extensions[index]}`;
      const uploadStream = bucket.openUploadStream(filename, {
        metadata: {
          author: fileDetails.author,
          post: fileDetails.post,
          filename: filename,
        },
      });

      return new Promise((resolve, reject) => {
        uploadStream.on("finish", () => {
          resolve(filename);
        });
        uploadStream.on("error", (e) => {
          console.log("error uploading file: ", e);
          reject(e);
        });
        uploadStream.end(file.buffer);
      });
    });

    const results = await Promise.all(promises);
    console.log(results);

    client.close();
    res.status(200).json({ message: "Files uploaded successfully!" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
}

//exporting all the functions
module.exports = {
  loginWithUsername,
  loginWithEmail,
  signupUser,
  checkUser,
  getPublicSnippets,
  getSnippets,
  addSnippet,
  deleteSnippet,
  getSnippet,
  updateSnippet,
  createPost,
  googleAuthenticate,
  googleRedirect,
  githubAuthenticate,
  githubRedirect,
  loginSuccess,
  logout,
  verifyjwt,
  togglePinStatus,
  followUser,
  unfollowUser,
  getnotifications,
  uploadFiles,
};
