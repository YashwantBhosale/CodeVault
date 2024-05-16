const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

function createToken(id) {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "1d" });
}

function getToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return 401;
  }

  const token = authHeader.split(' ')[1];
  return token;
}

function verifyjwt(token) {
  jwt.verify(process.env.SECRET, token, (err, decoded) => {
    if (err) return 400;
    return 200;
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
      token
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
      token
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
  const token = getToken(req);
  if(token === 401){
    res.status(401).json({message: "unauthorised"});
  }
  let verifcation = verifyjwt(token);

  if(verifcation === 400){
    res.status(400).json({message: "Invalid token"});
  }

  const { email, title, code, language, description, tags, isPublic } = req.body;

  try {
    await User.addSnippet(email, title, code, language, description, tags, isPublic);
    res.status(200).json({ message: "Success!" });
  }catch(e){
    res.status(400).json({ message: e.message });
  }

}

async function deleteSnippet(req, res) {
  const token = getToken(req);
  if(token === 401){
    res.status(401).json({message: "unauthorised"});
  }
  let verifcation = verifyjwt(token);

  if(verifcation === 400){
    res.status(400).json({message: "Invalid token"});
  }

  const { email, snippetId } = req.body;

  try {
    await User.deleteSnippet(email, snippetId);
    res.status(200).json({ message: "Success!" });
  }catch(e){
    res.status(400).json({ message: e.message });
  }
}

async function getSnippet(req, res) {
  const token = getToken(req);
  if(token === 401){
    res.status(401).json({message: "unauthorised"});
  }
  let verifcation = verifyjwt(token);

  if(verifcation === 400){
    res.status(400).json({message: "Invalid token"});
  }
  
    const { email, snippetId } = req.body;
    console.log("email, id : ", email, snippetId);
  
    try {
      const snippet = await User.getSnippetById(email, snippetId);
      console.log("snippet ; ", snippet);
      res.status(200).json(snippet);
    }catch(e){
      console.log(e.message);
      res.status(400).json({ message: e.message });
    }
}

async function updateSnippet(req, res) {
  const token = getToken(req);
  if(token === 401)
    res.status(401).json({message: "unauthorised"});
  let verification = verifyjwt(token);

  if(verification === 400){
    res.status(400).json({message: "Invalid token"});
  }
  const { email, snippetId, title, code, language, description, tags, isPublic } = req.body;
  try {
    await User.updateSnippet(email, snippetId, title, code, language, description, tags, isPublic)
    res.status(200).json({message: "Success!"});
  }catch(e) {
    console.log(e.message);
    res.status(400).json({message: e.message});
  }
}

async function createPost(req, res) {
  const token = getToken(req);
  if(token === 401)
    res.status(401).json({message: "unauthorised"});
  let verification = verifyjwt(token);

  if(verification === 400){
    res.status(400).json({message: "Invalid token"});
  }
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
  createPost
};
