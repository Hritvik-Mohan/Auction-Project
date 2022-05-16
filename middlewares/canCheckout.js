/**
 * Model Imports
 */
const Transaction = require("../models/transaction.model");

/**
 * @description - This middleware checks two things: 
 *                1. If the buyer has the shipping and billing address. 
 *                   1.1. If not, it takes buyer to a page to add the addresses.
 *                2. If the buyer has already paid for the product.
 *                   2.2. If not, it takes buyer to a page to pay for the product.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {object} next - The next middleware function.
 */
const canCheckout = async (req, res, next) => {
    const user = req.user;
    const product = req.product;

    if (!user.address.billingAddress || !user.address.shippingAddress) {
        req.flash("error", "Please add your billing and shipping address");
        return res.redirect("/users/addAddress");
    }

    const transaction = await Transaction.findOne({ bidder: user._id, product: product._id });

    if (!transaction) return next();
    
    if(transaction.paymentStatus !== "paid") return next();
    
    if(transaction.paymentStatus === "paid") {
        req.flash("error", "You have already paid for this product. Check your mail");
        return res.redirect(`/products/${product._id}`);
    }
}

module.exports = canCheckout;