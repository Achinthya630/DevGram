const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const cookieParser = require("cookie-parser");


const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');


//connects to the db, returns a promise, so we use then and catch.
connectDB()
  .then(() => {
    console.log("Connected to the database");
    app.listen(7777, () => {
      console.log("Server started on port 7777");
    });
  })
  .catch((err) => {
    console.error("Error connecting to the DB");
  });

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

