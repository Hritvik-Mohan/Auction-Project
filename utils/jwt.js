const jwt = require("jsonwebtoken")

/**
 * This function create a JWT Token based on user._id, secret key and expiration time
 * 
 * @param {object} user 
 * @returns {string} JWT Token  
 */
const newToken = (id) => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXP,
    });
};

/**
 * This function varifies JWT token and give out id of the user it belongs to.
 * We can further use the id to find the user and authenticate accordingly.
 * 
 * @param {string} JWT token 
 * @returns {object} payload i.e. user._id 
 */
const verifyToken = (token) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) return reject(err);
            resolve(payload);
        });
    });

module.exports = { newToken, verifyToken };