const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

function createToken(id) {
  return jwt.sign({id}, process.env.SECRET, {expiresIn: "1d"});
}

async function loginWithUsername(req, res) {
  const { username, password } = req.body;
  console.log("username: ", username, "password: ", password);
  try {
    const user = await User.loginWithUsername(username, password);
    const token = createToken(user._id);
    res.status(200).json(user.username, user.avtar, user.email, token);
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
    res.status(200).json(user.username, user.avtar, user.email, token);
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
    const response = { username: user.username, avtar: user.avtar, email: user.email, token };
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

  try {
    const snippets = await User.getSnippets(email);
    res.status(200).json(snippets);
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
};
