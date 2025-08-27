const jwt = require('jsonwebtoken');
const User = require("../models/user");



const userAuth = async(req,res, next) => {
    try {
        //get the token
        const {token} = req.cookies;
        if(!token) {
            throw new Error("User Logged Out");
        }
        //verify the token
        const decodedToken = jwt.verify(token,"devgRAM@630");
        const userID = decodedToken._id;
        const user = await User.findById(userID);

        if(!user){
        throw new Error("User Data Corrupted!!")
        }
        req.user = user;
        next();

    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
    
}

module.exports = {userAuth}