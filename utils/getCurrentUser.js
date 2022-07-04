/**
 * Model imports.
 */
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Bid = require("../models/bid.model");
const Transaction = require("../models/transaction.model");

/**
 * Utils.
 */
const { verifyToken } = require("./jwt");
const getUserStats = require("./getUserStats")

/**
 * If returns the current user if it is logged in.
 * 
 * @param {req} - The request object. 
 * @returns {object} - The user object.
 * @returns {undefined} - if user is not authenticated
 */
const getCurrentUser = async (req, res) => {
    try {
        if(req.signedCookies && req.signedCookies.token){
            const token = req.signedCookies.token;
            const payload = await verifyToken(token, process.env.JWT_SECRET);
            const user = await User
                .findById(payload.id)
                .select("-password -tokens");
                
            return await getUserStats(user);
        } else {
            return undefined;
        }
    } catch(err){
        return undefined;
    }
}

module.exports = getCurrentUser;