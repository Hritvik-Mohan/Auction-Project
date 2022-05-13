const { verifyToken } = require("../utils/jwt");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.model");

/**
 * Get the profile of logged in user.
 * 
 * @params {object} req
 * @params {object} res
 * @params {fuction} next
 * @returns next() | if user is verified
 * @returns error | if user is not verified and redirects to login page
 */
const protect = catchAsync( async (req, res, next)=>{
    let jwtToken;
    
    req.session.returnTo = req.originalUrl;

    if(req.signedCookies && req.signedCookies.token){
        try{
            // Get token from header
            jwtToken = req.signedCookies.token;

            // Verify the token
            const payload = await verifyToken(jwtToken, SECRETS.JWT_SECRET);

            // Find the user based on its id and set it to req.user
            req.user = await User.findOne({_id: payload.id, "tokens.token": jwtToken }).select("-password");
            req.token = jwtToken;

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