const express = require("express");

const app = express();



app.use("/test", (req, res) => {
  res.send("This is a test");
});

app.use("/hello", (req, res) => {
  res.send("Hello from the server");
});

app.use("/", (req, res) => {
  res.send("Hello World");
});

app.listen(7777, () => {
  console.log("Server started on port 7777");
});
