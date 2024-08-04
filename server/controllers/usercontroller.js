const User = require("../models/userModel");
const Snippet = require("../models/snippetModel");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const mongodb = require("mongodb");
const Notification = require("../models/notificationModel");
const mongoClient = mongodb.MongoClient;
const sendMail = require("../config/mailer");
// for creating token
function createToken(id) {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "2h" });
}

//for verifying token
function verifyjwt(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "unauthorised" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: "Invalid token" });
    }
    req.user = decoded;
    console.log("successfully verified token!", next);
    next();
  });
}

function validateJWT(req, res) {
  try {
    console.log("verifying jwt...");
    const { id } = req.body;
    console.log("id for jwt: ", id);
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "unauthorised" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Invalid token" });
      }
      
      if (decoded.id === id) {
        console.log("valid token", decoded);
        return res.status(200).json({ message: "Valid token" });
      } else {
        console.log("invalid token", decoded);
        return res.status(401).json({ message: "Invalid token" });
      }
    });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ message: e.message });
  }
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
      id: user._id,
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
      id: user._id,
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
      id: user._id,
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
    const post = await User.createPost(
      email,
      title,
      content,
      author,
      tags,
      isPublic,
      files
    );
    return res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
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

async function removeFollower(req, res) {
  const { email, username, followObj } = req.body;
  try {
    await User.removeFollower(email, username, followObj);
    res.status(200).json({ message: "SUCCESS!" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
}

async function getnotifications(req, res) {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username }).populate("notifications");
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

async function updateReadStatus(req, res) {
  const { username, notificationIds } = req.body;
  console.log("notificationIds: ", notificationIds);
  try {
    const user = await User.findOne({ username });
    if (!user) throw Error("User not found!");

    notificationIds.forEach(async (notificationId) => {
      const notification = await Notification.findOne({ _id: notificationId });
      if (!notification) throw Error("Notification not found!");
      notification.isSeen = true;
      await notification.save();
    });

    res.status(200).json({ message: "SUCCESS!" });
  } catch (e) {
    console.log("error in updateReadStatus: ", e.message);
    res.status(400).json({ message: e.message });
  }
}

async function clearNotifications(req, res) {
  const { username, ids } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) throw Error("User not found!");

    ids.forEach(async (id) => {
      const notification = await Notification.deleteOne({ _id: id });
      console.log("notification: ", notification);
      if (!notification.acknowledged) throw Error("Notification not found!");
    });
    user.notifications = user.notifications.filter(
      (notification) => !ids.includes(notification._id)
    );
    await user.save();
  } catch (e) {
    console.log("error in clearNotifications: ", e.message);
    res.status(400).json({ message: e.message });
  }
}

async function getFavouriteSnippets(req, res) {
  const { username } = req.body;
  console.log(username, req.body);
  try {
    const user = await User.findOne({ username });
    if (!user) throw Error("User not found!");

    console.log("user: ", user);

    if (!user.favouriteSnippets || user.favouriteSnippets.length === 0) {
      return res.status(200).json({ favourites: [] });
    } else {
      const favouriteSnippets = await Snippet.find({
        _id: { $in: user.favouriteSnippets },
      });
      res.status(200).json({ favouriteSnippets });
    }
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
      const filename = `${fileDetails.author}-${fileDetails.post}-${index}.${extensions[index]}`;
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

async function inviteUser(req, res) {
  const { email, roomId, username } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (!user) throw Error("User not found!");

    let notification = new Notification({
      type: "Invite",
      content: `"${username}" invited you to chatroom ${roomId}!`,
      user: user._id,
    });

    await notification.save();

    user.notifications.push(notification._id);

    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chatroom Invitation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 50px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                padding: 20px;
            }
            h1 {
                font-size: 24px;
                color: #333333;
                text-align: center;
            }
            p {
                font-size: 16px;
                color: #666666;
                line-height: 1.5;
            }
            .button {
                display: block;
                width: 200px;
                margin: 20px auto;
                padding: 10px 20px;
                text-align: center;
                background-color: #007BFF;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
            }
            .button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1><b>${username}</b> has invited you to join a chatroom!</h1>
            <p>Hi there,</p>
            <p>You have been invited to join a chatroom by <b>${username}</b>. Click the button below to join the chatroom and start chatting!</p>
            <a href="https://code-vault-new-frontend.vercel.app/room/${roomId}" class="button">Join Chatroom</a>
        </div>
    </body>
    </html>`;

    // Use your existing sendMail function
    sendMail(email, "Chatroom Invitation", html);

    await user.save();

    res.status(200).json({ message: "SUCCESS!" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
}

async function toggleFavouriteSnippet(req, res) {
  const { email, snippetId } = req.body;
  try {
    await User.toggleFavouriteSnippet(email, snippetId);
    res.status(200).json({ message: "SUCCESS!" });
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
  updateReadStatus,
  clearNotifications,
  inviteUser,
  removeFollower,
  toggleFavouriteSnippet,
  getFavouriteSnippets,
  validateJWT
};
