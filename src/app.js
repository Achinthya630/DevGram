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

app.use(express.json());

app.post("/signup", async (req, res) => {
  //we need to use the User model that we imported and create an instance of it. We use const name = new ModelName({obj});
  const userData = new User(req.body);

  //we can now save the instance - push it to the db using the .save() method. User.save() is using await.

  try {
    await userData.save();
    res.send("User data saved to DB successfully");
  } catch (error) {
    res.status(400).send("Error saving data to DB " + error);
  }
});

app.get("/user", async (req, res) => {
  // const userEmail = req.body.emailID;
  // console.log(userEmail);

  try {
    const user1 = await User.find(); //mongodb command to find
    if (!user1) {
      res.status(404).send("User not found");
    } else {
      res.send(user1);
    }
  } catch {
    res.status(404).send("Something went wrong");
  }
});

app.get("/user/one", async (req, res) => {
  const userEmail = req.body.emailID;

  try {
    const user = await User.findOne({ emailID: userEmail }); //mongodb command findOne
    if (!user) {
      res.status(404).send("No user found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(404).send("Some error");
  }
});

app.get("/user/byId", async (req, res) => {
  const id = req.body._id;

  try {
    const user = await User.findById(id); //find the user based on the id
    if (!user) {
      res.status(404).send("No user found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Error:" + error);
  }
});

app.patch("/update/:userID", async (req, res) => {
  const id = req.params?.userID;
  const update = req.body;

  try {
    const ALLOWED_UPDATES = ["firstName", "lastName", "password"];
    const isUpdateAllowed = Object.keys(update).every((k) => ALLOWED_UPDATES.includes(k));
    if(!isUpdateAllowed){
      throw new Error("Update not allowed");
    }
    const data = await User.findByIdAndUpdate(id, update,{
      runValidators: true
    });
    if (!data) {
      res.send("No user found");
    } else {
      res.send("Updated the data");
    }
  } catch (error){
    res.status(400).send("Something went wrong " + error);
  }
});
