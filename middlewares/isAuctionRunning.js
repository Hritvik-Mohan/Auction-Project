/**
 * Model imports.
 */
const Product = require("../models/product.model");

/**
 * Utils imports
 */
const AppError = require("../utils/AppError")

/**
 * This middleware checks if the auction is still running.
 * If aution is still running then it calls the next.
 * else it responds with the message that auction is not running.
 */
const isAuctionRunning = async (req, res, next) => {

    // 1. Get product id.
    const {
        id
    } = req.params;

    // 2. Get product data.
    const product = await Product.findById(id);
    if(!product) throw new AppError('Product not found', 404);
    // 3. Set product property to req.
    req.product = product;

    // 4. Get current time, start time and end time of the product.
    const today = new Date();
    const startTime = product.startTime;
    const endTime = new Date(product.endTime);
    
    if (startTime <= today && endTime >= today) {
        return next();
    } else {
        return res.send({
            msg: 'Auction is not running.'
        });
    }
}

module.exports = isAuctionRunning;