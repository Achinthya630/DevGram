const adminAuth =  (req,res,next) => {
    console.log("Authorizing...");
    const token = "xyz";
    let auth = (token === "xyz")?1:0;
    if(!auth){
        res.status(401).send("You are not authorised to access.");
    } else {
        console.log("Authorized successfully");
        next();
    }
};


module.exports = {adminAuth}