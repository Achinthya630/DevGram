const express = require("express");

const app = express();

app.listen(7777, () => {
  console.log("Server started on port 7777");
});

app.use("/test", (req, res) => {
  res.send("This is a test");
});

app.get("/user", (req, res) => {
  res.send("Handling GET method to user.");
});

app.put("/user", (req, res) => {
  res.send("Handling PUT method to user");
});

app.delete("/user", (req, res) => {
  res.send("Handling delete method");
});

app.post("/user", (req, res) => {
  res.send("Handling POST method to user");
});

app.use(
  "/route",
  (req, res, next) => {
    console.log("Response 1");
    // res.send("Response sent from route handler 1");
    next();
  },
  (req, res, next) => {
    next();
    console.log("Response 2");
    // next();
    // res.send("Response sent from route handler 2");
  },
  (req, res) => {
    console.log("Response 3");
    res.send("Response sent from route handler 3");
  }
);
