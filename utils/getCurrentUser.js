const { verifyToken } = require("./jwt");

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
        const payload = await verifyToken(token, process.env.JWT_SECRET);
        return payload.id;
    } else {
        return undefined;
    }
}

module.exports = getCurrentUser;