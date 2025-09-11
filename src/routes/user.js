const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { Connection } = require("mongoose");

const SAFE_USER_DATA = "firstName lastName age gender photoUrl about skills";

//returns all the interested requests recieved by the logged in user
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await ConnectionRequest.find({
      toUserID: loggedInUser,
      status: "interested",
    }).populate("fromUserID", SAFE_USER_DATA);

    if (!requests || requests.length == 0) {
      return res.status(404).json({ Error: "No pending requests" });
    }

    res.json({ pendingRequests: requests });
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
});

//returns all the accepted connections for the logged in user - must include both to and from users
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserID: loggedInUser._id, status: "accepted" },
        { fromUserID: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserID", SAFE_USER_DATA)
      .populate("toUserID", SAFE_USER_DATA);

    const data = connections.map((row) => {
      if (row.fromUserID._id.toString() === loggedInUser._id.toString()) {
        return row.toUserID;
      }
      return row.fromUserID;
    });

    res.json({ Connections: data });
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
});

//algorithm to show the logged in user new users to be interested or ignore.
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    //get logged in user info
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 50 ? 50 : limit;
    const skips = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserID: loggedInUser._id }, { toUserID: loggedInUser._id }],
    }).select("fromUserID toUserID");

    //to put the connectionRequest users into a set
    const hideUsers = new Set();
    connectionRequests.forEach((req) => {
      hideUsers.add(req.fromUserID);
      hideUsers.add(req.toUserID);
    });

    const feed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(SAFE_USER_DATA)
      .skip(skips)
      .limit(limit);

    res.send(feed);
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
});

module.exports = userRouter;
