const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Snippet = require("./snippetModel");
const Post = require("./postModel");
const mongodb = require("mongodb");
const sendMail = require("../config/mailer");
const Notification = require("../models/notificationModel");
const mongoClient = mongodb.MongoClient;

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  avtar: {
    type: String,
    default: "user",
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  snipeets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Snippet",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  followers: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: String,
      avtar: String,
    },
  ],
  following: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: String,
      avtar: String,
    },
  ],
  favouriteSnippets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Snippet",
    },
  ],
});

// find user by usrname
userSchema.statics.findByUsername = async function (username) {
  const user = await this.findOne({ username });
  if (!user) {
    throw Error("User not found!");
  }
  return user;
};

// get user's public information:
userSchema.statics.getPublicInfo = async function (username) {
  const user = await this.findByUsername(username);
  if (!user) {
    throw Error("User not found");
  }

  const publicSnippets = await Snippet.find({
    author: user._id,
    isPublic: true,
  });
  const publicPosts = await Post.find({
    "author.id": user._id,
    isPublic: true,
  });

  const publicInfo = {
    id: user._id,
    username: user.username,
    avtar: user.avtar,
    followers: user.followers,
    following: user.following,
    publicSnippets: publicSnippets,
    publicPosts: publicPosts,
    joinedAt: user.createdAt,
  };
  return publicInfo;
};

// static Signup function
userSchema.statics.signup = async function (username, email, password, avtar) {
  const isEmailValid = await this.findOne({ email: email });
  if (isEmailValid) {
    throw Error("Email already in Use!");
  }

  const isUsernameValid = await this.findOne({ username: username });
  if (isUsernameValid) {
    throw Error("Username already in Use!");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({
    username,
    avtar,
    email,
    password: hashedPassword,
  });

  return user;
};

// static Login function
userSchema.statics.loginWithUsername = async function (username, password) {
  if (!username || !password) {
    throw Error("Invalid username or password!");
  }

  const user = await this.findOne({ username });

  if (!user) {
    throw Error("Invalid username!");
  }

  const passwordValidation = await bcrypt.compare(password, user.password);
  if (passwordValidation) {
    return user;
  } else {
    throw Error("Invalid password!");
  }
};

// static Login function
userSchema.statics.loginWithEmail = async function (email, password) {
  if (!email || !password) {
    throw Error("Invalid email or password!");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Invalid email!");
  }

  const passwordValidation = await bcrypt.compare(password, user.password);
  if (passwordValidation) {
    return user;
  } else {
    throw Error("Invalid password!");
  }
};

// static checkUser function
userSchema.statics.checkUser = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("User not found!");
  }
  return user;
};

// static getPublicSnippets function
userSchema.statics.getPublicSnippets = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("User not found!");
  }
  const snippets = await Snippet.find({ author: user._id, isPublic: true });
  return snippets;
};

// static getSnippets function
userSchema.statics.getSnippets = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("User not found!");
  }
  const snippets = await Snippet.find({ author: user._id });
  return snippets;
};

// static addSnippet function
userSchema.statics.addSnippet = async function (
  email,
  title,
  code,
  language,
  description,
  tags,
  isPublic
) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("User not found");
  }
  let author = user._id;
  const snippet = new Snippet({
    title,
    code,
    language,
    description,
    tags,
    isPublic,
    author,
  });
  await snippet.save();
  console.log("user", user, user.snipeets);
  user.snipeets.push(snippet._id);
  await user.save();
};

// static deleteSnippet function
userSchema.statics.deleteSnippet = async function (email, snippetId) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("User not found");
  }
  const snippet = await Snippet.findOne({ _id: snippetId });
  if (!snippet) {
    throw Error("Snippet not found");
  }
  await Snippet.deleteOne({ _id: snippetId });
};

// static getSnippetById function
userSchema.statics.getSnippetById = async function (email, snippetId) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("User not found");
  }
  const snippet = await Snippet.findOne({ _id: snippetId });
  if (!snippet) {
    throw Error("Snippet not found");
  }
  return snippet;
};

// static updateSnippet function
userSchema.statics.updateSnippet = async function (
  email,
  snippetId,
  title,
  code,
  language,
  description,
  tags,
  isPublic
) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("User not found");
  }
  const snippet = await Snippet.findOne({ _id: snippetId });
  if (!snippet) {
    throw Error("Snippet not found");
  }
  snippet.title = title;
  snippet.code = code;
  snippet.language = language;
  snippet.description = description;
  snippet.tags = tags;
  snippet.isPublic = isPublic;
  await snippet.save();
};

// static createPost function
userSchema.statics.createPost = async function (
  email,
  title,
  content,
  author,
  tags,
  isPublic,
  files
) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("User not found");
  }
  author = { ...author, id: user._id };
  const post = new Post({
    title,
    content,
    author,
    tags,
    isPublic,
    files,
  });

  // post.files = files;
  await post.save();
  user.posts.push(post._id);
  await user.save();

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Post Notification</title>
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
          <h1><b>${user.username}</b> has posted something new!</h1>
          <p>Hi there,</p>
          <p>We are excited to let you know that <b>${user.username}</b> has posted something new. Check out their post and stay connected!</p>
          <a href="https://code-vault-new-frontend.vercel.app/viewpost?postId=${post._id}" class="button">View Post</a>
      </div>
  </body>
  </html>`;

  user.followers.forEach(async (follower) => {
    let followingUser = await this.findOne({ _id: follower.id });
    let date = new Date();

    let notification = new Notification({
      type: "Post",
      postId: post._id,
      content: `"${user.username}" has posted something new!`,
      user: followingUser._id,
    });
    await notification.save();

    followingUser.notifications.push(notification._id);

    sendMail(followingUser.email, "New Post Notification", html);
    await followingUser.save();
  });

  return post;
};

// static getallusers function
userSchema.statics.getAllUsers = async function () {
  const users = await this.find();
  const usersData = users.map((user) => {
    return {
      username: user.username,
      avtar: user.avtar,
      email: user.email,
    };
  });
  return usersData;
};

// follow function
userSchema.statics.follow = async function (email, username, followObj) {
  const user = await this.findOne({ email, username }); // Current User
  if (!user) throw Error("User not found!");
  console.log(followObj);
  const followingUser = await this.findOne({
    // User to be followed
    _id: followObj.id,
    username: followObj.username,
  });
  if (!followingUser) throw Error("Invalid user was followed!");

  if (
    user.following.find((following) => following.username == followObj.username)
  ) {
    throw Error("Already following the user");
  }

  user.following.push(followObj);
  followingUser.followers.push({
    id: user._id,
    username: user.username,
    avtar: user.avtar,
  });

  let date = new Date();

  // followingUser.notifications.push({
  //   type: "Follow",

  //   content: `"${user.username}" started following you!`,
  //   timestamp: date,
  // });

  let notification = new Notification({
    type: "Follow",
    content: `"${user.username}" started following you!`,
    user: followingUser._id,
  });
  await notification.save();

  followingUser.notifications.push(notification._id);

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Follower Notification</title>
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
          <h1><b>${user.username}</b> started following you!</h1>
          <p>Hi <b>${followingUser.username}</b>,</p>
          <p>We are excited to let you know that <b>${user.username}</b> has started following you.Check out their profile and stay connected!</p>
          <a href="https://code-vault-new-frontend.vercel.app/viewprofile?username=${user.username}" class="button">View Profile</a>
      </div>
  </body>
  </html>`;
  sendMail(followingUser.email, "New Follower", html);

  await user.save();
  await followingUser.save();
};

userSchema.statics.unfollow = async function (email, username, followObj) {
  const user = await this.findOne({ email, username }); // current user
  if (!user) throw Error("User not found!");

  const followingUser = await this.findOne({
    // followed user to be unfollowed
    _id: followObj.id,
    username: followObj.username,
  });
  if (!followingUser) throw Error("Invalid user was unfollowed!");

  user.following = user.following.filter(
    (followingUser) => followingUser.username != followObj.username
  );

  followingUser.followers = followingUser.followers.filter(
    (follower) => follower.username != user.username
  );

  await user.save();
  await followingUser.save();
};

userSchema.statics.removeFollower = async function (
  email,
  username,
  followObj
) {
  const user = await this.findOne({ email, username }); // current user
  if (!user) throw Error("User not found!");

  const followerUser = await this.findOne({
    // follower to be removed
    _id: followObj.id,
    username: followObj.username,
  });
  if (!followerUser) throw Error("Invalid user was removed!");

  user.followers = user.followers.filter(
    (follower) => follower.username != followObj.username
  );

  followerUser.following = followerUser.following.filter(
    (followingUser) => followingUser.username != user.username
  );

  await user.save();
  await followerUser.save();
};

userSchema.statics.toggleFavouriteSnippet = async function (email, snippetId) {
  const user = await this.findOne({ email });
  if (!user) throw Error("User not found!");

  const snippet = await Snippet.findOne({ _id: snippetId });
  if (!snippet) throw Error("Snippet not found!");

  let userObj = {
    id: user._id,
    username: user.username,
    avtar: user.avtar,
  };

  if (snippet.favourites) {
    if (snippet.favourites.some((favourite) => favourite.id.equals(user._id))) {
      snippet.favourites = snippet.favourites.filter(
        (favourite) => !favourite.id.equals(user._id)
      );
    } else {
      snippet.favourites.push(userObj);
    }
  } else {
    snippet.favourites = [];
    snippet.favourites.push(userObj);
  }

  if (
    user.favouriteSnippets.some((favouriteSnippet) =>
      favouriteSnippet.equals(snippetId)
    )
  ) {
    user.favouriteSnippets = user.favouriteSnippets.filter(
      (favouriteSnippet) => !favouriteSnippet.equals(snippetId)
    );
  } else {
    user.favouriteSnippets.push(snippetId);
  }

  await user.save();
  await snippet.save();
};

module.exports = mongoose.model("User", userSchema);
