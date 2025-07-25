const mongoose = require("mongoose");
//creating a schema - use this: 
const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailID: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    }
});

//creating a model using the schema that we just created: 
const User = mongoose.model("User",userSchema);

module.exports = User;


//you can also do module.exports = mongoose.model("User", userScheme) directly instead of creating another const