const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const userRoutes = require("./routes/user");
const publicRoutes = require("./routes/public");

const passport = require("passport");
const session = require("express-session");
require("./config/passport");


//for environment variables
dotenv.config();
//for express
const app = express();

//cors becuase we are running frontend and backend on different ports
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//middlewares
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/api/user", userRoutes);
app.use("/api/public", publicRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});


//connecting to mongoDB
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

db.on("connected", () => {
  app.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
  console.log("We Got the Mongo!");
});

db.on("error", (err) => {
  console.log("Mongo Error: ", err);
});
