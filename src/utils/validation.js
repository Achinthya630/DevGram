const validator = require('validator');

const validateSignupData = (req) => {
    const {password} = req.body;
    if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password");
    }
};


module.exports = {
    validateSignupData
}