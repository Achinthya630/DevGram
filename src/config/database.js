const mongoose = require("mongoose");
//putting the connection inside an async function so that it establishes the connection and only then moves forward
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://achinthya630:myUnsZHtkFUghfLP@devgramcluster.epgi5li.mongodb.net/devgram"
  );
};

//exporting the connectDB function to be used in app.js
module.exports = connectDB;
