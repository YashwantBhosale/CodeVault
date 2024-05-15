const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user");


dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:3000"}));
app.use(express.json());

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
