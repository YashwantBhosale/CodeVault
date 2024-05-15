const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Snippet = require("./snippetModel");
const mongodb = require("mongodb");
const { signupUser } = require("../controllers/usercontroller");

const mongoClient = mongodb.MongoClient;

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
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
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

userSchema.statics.checkUser = async function (email) {
    const user = await this.findOne({ email });
    if (!user) {
        throw Error("User not found!");
    }
    return user;
}

userSchema.statics.getPublicSnippets = async function (email) {
    const user = await this.findOne({ email });
    if (!user) {
        throw Error("User not found!");
    }
    const snippets = await Snippet.find({ author: user._id, isPublic: true});
    return snippets;
}

userSchema.statics.getSnippets = async function (email) {
    const user = await this.findOne({ email });
    if (!user) {
        throw Error("User not found!");
    }
    const snippets = await Snippet.find({ author: user._id});
    return snippets;

}

module.exports = mongoose.model("User", userSchema);