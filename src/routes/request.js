const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const authRouter = require("./auth");
const connectionRequest = require("../models/connectionRequest");

requestRouter.post(  "/request/send/:status/:toUserID",
  userAuth,
  async (req, res) => {
    try {
      const fromUserID = req.user._id;
      const toUserID = req.params.toUserID;
      const status = req.params.status;

      //validations
      //to check if the status is allowed
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status");
      }

      //to check if the toUserID is a valid user in the system.
      const isValidToUser = await User.findById(toUserID);
      if (!isValidToUser) {
        throw new Error("Invalid Reciever");
      }

      //to check if the request has already been sent before
      const isRepeatedRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserID, toUserID },
          { fromUserID: toUserID, toUserID: fromUserID },
        ],
      });
      if (isRepeatedRequest) {
        throw new Error("Connection Request already sent");
      }

      //check if the toUser and the fromUser is the same
      if (toUserID == fromUserID) {
        throw new Error("You cannot send request to yourself");
      }

      //saving to the database
      const connectionRequest = new ConnectionRequest({
        fromUserID,
        toUserID,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: "Connection request has been sent successfully",
        request: data,
      });
    } catch (error) {
      res.status(400).json({
        Error: error.message,
      });
    }
  }
);

requestRouter.post("/request/review/:status/:requestID", userAuth, async(req,res)=>{
    try {
       const loggedInUser = req.user;
       const {status, requestID} = req.params;
       
       const allowedStatus = ["accepted", "rejected"];
       if(!allowedStatus.includes(status)){
        return res.status(400).json({Error: "Status not valid"});
       }

       const connectionRequest = await ConnectionRequest.findOne({
        _id: requestID,
        toUserID: loggedInUser,
        status: "interested"
       });

       if(!connectionRequest){
        return res.status(404).json({Error: "Connection request not found"});
       }

       connectionRequest.status = status;
       const data = await connectionRequest.save();

       res.json({Message: "Request has been " + status, data});

    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
})

module.exports = requestRouter;
