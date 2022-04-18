/**
 * Model imports.
 */
const Product = require("../models/product.model");

const isTimeRemaining = async (req, res, next) => {
    
    // 1. Get product id.
    const { productId } = req.params;

    // 2. Get product data.
    const product = await Product.findById(productId);

    // 3. Get current time.
    const today = new Date();

    // 4. Get end time of the auction
    const endTime = new Date(product.endTime);

    // If end time is greater than today, then allow to bid.
    if (endTime > today) {
        return next();
    } else {
        req.flash('error', 'Bid is closed.');
        return res.redirect(`/products/${productId}`);
    }
}

module.exports = isTimeRemaining;