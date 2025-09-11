const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validation");
const validator = require("validator");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try {
    //validate password - is strong password??
    validateSignupData(req);

    const { firstName, lastName, emailID, password } = req.body;

    //password encryption using bcrypt
    const passHash = await bcrypt.hash(password, 10);

    //we need to use the User model that we imported and create an instance of it. We use const name = new ModelName({obj});
    const userData = new User({
      firstName,
      lastName,
      emailID,
      password: passHash,
    });

    //we can now save the instance - push it to the db using the .save() method. User.save() is using await.

    await userData.save();
    res.send("User saved to the DB");
  } catch (error) {
    res.status(400).send("Error saving data to DB " + error);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;

    if (!validator.isEmail(emailID)) {
      throw new Error("Invalid email address");
    }

    const user = await User.findOne({ emailID: emailID }); //needs to be await or else gives error
    if (!user) {
      throw new Error("User not linked to a DevGram account");
    }

    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 86400000) });
      res.send(user);
    } else {
      throw new Error("Incorrect username or password");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logged out");
});

module.exports = authRouter;
