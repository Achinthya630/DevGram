const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const user = require("../models/user");
const bcrypt = require("bcrypt");

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const id = req.user._id;
  const update = req.body;

  try {
    if (req.user.firstName.length < 3 || req.user.lastName.length < 3) {
      throw new Error("Minimum length of first name and last name is 3");
    }
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "photoUrl",
      "about",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(update).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (update.skills) {
      if (!Array.isArray(update.skills)) {
        throw new Error("Skills must be an array");
      }
      // Validate each skill if needed
      update.skills.forEach((skill) => {
        if (typeof skill !== "string") {
          throw new Error("Skills must be strings");
        }
      });
    }
    const data = await User.findByIdAndUpdate(id, update, {
      runValidators: true,
    });
    if (!data) {
      res.send("No user found");
    } else {
      res.json({ data: data });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    const isValidPassword = await user.validatePassword(oldPassword);
    if (!isValidPassword) {
      throw new Error("Wrong password");
    }
    const passHash = await bcrypt.hash(newPassword, 10);
    user.password = passHash;
    await user.save();
    res.send("Password updated");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = profileRouter;
