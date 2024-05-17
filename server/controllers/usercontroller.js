const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const passport = require("passport");

function createToken(id) {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "1d" });
}


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
    console.log("successfully verified token!", next)
    next();
  });
}

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

function loginSuccess(req, res) {
  if (req.user) {
    res
      .json({
        success: true,
        message: "user has successfully authenticated",
        user: req.user,
        cookies: req.cookies,
      })
      .status(200);
  }
}

function logout(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000/");
  });
}

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

async function checkUser(req, res) {
  const { email } = req.body;
  try {
    const user = await User.checkUser(email);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getPublicSnippets(req, res) {
  const { email } = req.body;
  try {
    const publicSnippets = await User.getPublicSnippets(email);
    res.status(200).json(publicSnippets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

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

async function addSnippet(req, res) {
  const { email, title, code, language, description, tags, isPublic } =
    req.body;
    console.log("req.user.emai : ", req.user.email, req.user);
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

async function deleteSnippet(req, res) {
  const { email, snippetId } = req.body;

  try {
    await User.deleteSnippet(email, snippetId);
    res.status(200).json({ message: "Success!" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

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

async function createPost(req, res) {

  const { email, title, content, author, tags, isPublic } = req.body;

  try {
    await User.createPost(email, title, content, author, tags, isPublic);
    res.status(200).json({ message: "Success!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

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
  verifyjwt
};
