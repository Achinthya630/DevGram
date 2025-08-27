const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');

requestRouter.post("/sendConnectionRequest", userAuth, (req,res) => {
  console.log("Works only if the user is authenticated by the userAuth");
  res.send("Connection Requst Sent");
});

module.exports = requestRouter;