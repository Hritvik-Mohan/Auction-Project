const { verifyToken } = require("./jwt");
const SECRETS = require("../configs/config");
const User = require("../models/user.model");

/**
 * If returns the current user if it is logged in.
 * 
 * @param {} 
 * @returns {user} if user is authenticated
 * @returns {undefined} if user is not authenticated
 */
const getCurrentUser = async (req, res) => {
    if(req.signedCookies && req.signedCookies.token){
        const token = req.signedCookies.token;
        const payload = await verifyToken(token, SECRETS.JWT_SECRET);
        return payload.id;
    } else {
        return undefined;
    }
}

module.exports = getCurrentUser;