const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

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

app.post("/signup", async (req, res) => {
  //we need to use the User model that we imported and create an instance of it. We use const name = new ModelName({obj});
  const userData = new User({
    firstName: "Ananya",
    lastName: "Maiya",
    emailID: "ananya@gmail.com",
    password: "ananya@123",
    age: 21,
  });

  //we can now save the instance - push it to the db using the .save() method. User.save() is using await.

  try {
    await userData.save();
    res.send("User data saved to DB successfully");
  } catch (error) {
    res.status(400).send("Error saving data to DB");
  }
});
