const mongoose = require("mongoose");
//creating a schema - use this: 
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLenght: 30

    },
    lastName: {
        type: String,
        minLength: 3,
        maxLenght: 30
    },
    emailID: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(value)) throw new Error("Not a valid email address");
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Invalid gender");
            }
        }
    }

},
{
    timestamps: true
}
);

//creating a model using the schema that we just created: 
const User = mongoose.model("User",userSchema);

module.exports = User;


//you can also do module.exports = mongoose.model("User", userScheme) directly instead of creating another const