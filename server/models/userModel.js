const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Snippet = require("./snippetModel");
const Post = require("./postModel");
const mongodb = require("mongodb");
const { signupUser } = require("../controllers/usercontroller");

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
  notifications: {
    type: Array,
    default: [],
  },
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
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
});

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

  const user = await this.create({ username, avtar, email, password: hashedPassword });

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

  const passwordValidation = await bcrypt.compare(
    password,
    user.password
  );
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

  const passwordValidation = await bcrypt.compare(
    password,
    user.password
  );
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
}


// static getPublicSnippets function
userSchema.statics.getPublicSnippets = async function (email) {
    const user = await this.findOne({ email });
    if (!user) {
        throw Error("User not found!");
    }
    const snippets = await Snippet.find({ author: user._id, isPublic: true});
    return snippets;
}

// static getSnippets function
userSchema.statics.getSnippets = async function (email) {
    const user = await this.findOne({ email });
    if (!user) {
        throw Error("User not found!");
    }
    const snippets = await Snippet.find({ author: user._id});
    return snippets;
}

// static addSnippet function
userSchema.statics.addSnippet = async function (email, title, code, language, description, tags, isPublic)  {
  const user = await this.findOne({ email });
  if(!user){
    throw Error("User not found");
  }
  let author = user._id;
  const snippet = new Snippet({title, code, language, description, tags, isPublic, author});
  await snippet.save();
  console.log("user", user, user.snipeets);
  user.snipeets.push(snippet._id);
  await user.save();
}

// static deleteSnippet function
userSchema.statics.deleteSnippet = async function (email, snippetId) {
  const user = await this.findOne({ email });
  if(!user){
    throw Error("User not found");
  }
  const snippet = await Snippet.findOne({ _id: snippetId });
  if(!snippet){
    throw Error("Snippet not found");
  }
  await Snippet.deleteOne({ _id: snippetId });
}


// static getSnippetById function
userSchema.statics.getSnippetById = async function (email, snippetId) {
  const user = await this.findOne({ email });
  if(!user){
    throw Error("User not found");
  }
  const snippet = await Snippet.findOne({ _id: snippetId });
  if(!snippet){
    throw Error("Snippet not found");
  }
  return snippet;
}

// static updateSnippet function
userSchema.statics.updateSnippet = async function (email, snippetId, title, code, language, description, tags, isPublic) {
  const user = await this.findOne({ email });
  if(!user){
    throw Error("User not found");
  }
  const snippet = await Snippet.findOne({ _id: snippetId });
  if(!snippet){
    throw Error("Snippet not found");
  }
  snippet.title = title;
  snippet.code = code;
  snippet.language = language;
  snippet.description = description;
  snippet.tags = tags;
  snippet.isPublic = isPublic;
  await snippet.save();
}


// static createPost function
userSchema.statics.createPost = async function (email, title, content, author, tags, isPublic) {
  const user = await this.findOne({ email });
  if(!user){
    throw Error("User not found");
  }
  author = {...author, id: user._id};
  const post = new Post({title, content, author, tags, isPublic});
  await post.save();

  user.posts.push(post._id);
  await user.save();
}


module.exports = mongoose.model("User", userSchema);