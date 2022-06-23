const { verifyToken } = require("../utils/jwt");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.model");

/**
 * @description - This middlware checks if the user is logged in or not.
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
            const payload = await verifyToken(jwtToken, process.env.JWT_SECRET);

            // Find the user based on its id and set it to req.user
            req.user = await User.findOne({_id: payload.id, "tokens.token": jwtToken }).select("-password");
            req.token = jwtToken;

            if(!req.user) return res.redirect("/users/login");
            
            next();
        }catch(err){
            req.flash("error", "session expired login again");
            return res.redirect("/users/login");
        }
    }
    if(!jwtToken){
        req.flash("error", "You need to login first");
        return res.redirect('/users/login');
    }
})

module.exports = protect;