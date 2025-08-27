const express = require('express');
const profileRouter = express.Router();
const User = require('../models/user');
const {userAuth} = require('../middlewares/auth');
const user = require('../models/user');
const bcrypt = require('bcrypt');

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const id = req.user._id;
  const update = req.body;

  try {
    const ALLOWED_UPDATES = ["firstName", "lastName", "photourl", "about", "skills"];
    const isUpdateAllowed = Object.keys(update).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const data = await User.findByIdAndUpdate(id, update, {
      runValidators: true,
    });
    if (!data) {
      res.send("No user found");
    } else {
      res.send("Updated the data");
    }
  } catch (error) {
    res.status(400).send("Something went wrong " + error);
  }
});

profileRouter.get("/profile/view", userAuth, async(req,res)=>{
  try {
    const user = req.user;
    res.send(user);

  } catch (error) {
    res.status(400).send("Error: " + error.message); 
  }
})


profileRouter.patch("/profile/updatePassword", userAuth, async(req, res) => {
    try{
        const user = req.user;
        const {oldPassword, newPassword} = req.body;

        const isValidPassword = await user.validatePassword(oldPassword);
        if(!isValidPassword){
            throw new Error("Wrong password");
        }
        const passHash = await bcrypt.hash(newPassword, 10);
        user.password = passHash;
        await user.save();
        res.send("Password updated");
    } catch (error){
        res.status(400). send("Error: "  + error.message);
    }
})

module.exports = profileRouter;