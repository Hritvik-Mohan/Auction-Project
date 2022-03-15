const { verifyToken } = require("../utils/jwt");
const catchAsync = require("../utils/catchAsync");
const SECRETS = require("../configs/config");
const User = require("../models/user.model");


const protect = catchAsync( async (req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const payload = await verifyToken(token, SECRETS.JWT_SECRET);

            // Find the user based on its id and set it to req.user
            req.user = await User.findById(payload.id).select("-password");
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
    if(!token){
        return res.status(400).send({
            status: "failed",
            message: "Not authorized"
        })
    }
})

module.exports = protect;