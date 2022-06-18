/**
 * @description - This middleware checks if the user's profile is 
 * verified or not.
 * 
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next function
 * @returns 
 */
const isVerified = (req, res, next) => {
        
    const user = req.user;
    
    if (!user.verified) {
        req.flash("error", "Please verify your account first");
        return res.redirect("/users/verification");
    }

    next();
}

module.exports = isVerified;