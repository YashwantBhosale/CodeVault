const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require('http')
const {Server} = require('socket.io')
const userRoutes = require("./routes/user");
const publicRoutes = require("./routes/public");
const commentRoutes = require("./routes/comment");
const passport = require("passport");
const session = require("express-session");
require("./config/passport");


//for environment variables
dotenv.config();
//for express
const app = express();

//for socket-io
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: 'http://localhost:3000',
  }
});


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
app.use("/api/comment", commentRoutes);
app.get("/", (req, res) => {
  res.send('<i>A Computer is like air conditioning - it becomes useless when you open Windows- Linus Torvalds</i>');
});

const rooms = {};
const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
};

io.on('connection', (socket) => {
  socket.on('createRoom', (data, callback) => {
    const { username, avatar } = data;
    const roomId = generateRoomCode();
    rooms[roomId] = { users: [], messages: [] };
    socket.join(roomId);
    rooms[roomId].users.push({ id: socket.id, username , avatar });
    callback(roomId);
    io.to(roomId).emit('roomData', rooms[roomId].users);
  });

  socket.on('joinRoom', ({ roomId, username, avatar }, callback) => {
    if (rooms[roomId]) {
      socket.join(roomId);
      if(!rooms[roomId].users.find(user => user.username === username)){
      rooms[roomId].users.push({ id: socket.id, username, avatar });
      }
      callback(true, rooms[roomId].messages);  
      io.to(roomId).emit('roomData', rooms[roomId].users);
    } else {
      callback(false);
    }
  });

  socket.on('sendMessage', ({ roomId, message, username }) => {
    const msg = { user: username, message };
    rooms[roomId].messages.push(msg);  
    io.to(roomId).emit('message', msg);
  });

  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      const index = rooms[roomId].users.findIndex(user => user.id === socket.id);
      if (index !== -1) {
        rooms[roomId].users.splice(index, 1);
        io.to(roomId).emit('roomData', rooms[roomId].users);
      }
    }
  });
});


//connecting to mongoDB
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

db.on("connected", () => {
  server.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
  console.log("We Got the Mongo!");
});

db.on("error", (err) => {
  console.log("Mongo Error: ", err);
});
