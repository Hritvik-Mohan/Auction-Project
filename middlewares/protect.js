const { verifyToken } = require("../utils/jwt");
const catchAsync = require("../utils/catchAsync");
const SECRETS = require("../configs/config");
const User = require("../models/user.model");


const protect = catchAsync( async (req, res, next)=>{
    let jwtToken;

    if(req.signedCookies && req.signedCookies.token){
        try{
            // Get token from header
            jwtToken = req.signedCookies.token;

            // Verify the token
            const payload = await verifyToken(jwtToken, SECRETS.JWT_SECRET);

            // Find the user based on its id and set it to req.user
            req.user = await User.findById(payload.id).select("-password");

            if(!req.user) return res.redirect("/users/login");
            
            next();
        }catch(err){
            const error = err.message;

            console.log(err.message)
            console.log(err.stack)
            
            return res.status(401).send({
                status: "failed",
                message: "Not authorized",
                error
            })
        }
    }
    if(!jwtToken){
        return res.redirect('/users/login');
    }
})

module.exports = protect;