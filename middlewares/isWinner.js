/**
 * Model imports.
 */
const Product = require("../models/product.model");

/**
 * @description - This middleware checks if the logged in user is the winner of the product.
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns next() | if user is the winner
 * @returns res.redirect('/products/:productId') | if user is not the winner
 */
const isWinner = async (req, res, next) => {

    const currentUser = req.user;
    let product = req.product;

    if(!product){
        const { id: productId } = req.params;
        product = await Product.findById(productId);
    }
   
    if (currentUser._id.equals(product.currentHighestBid.user) && !currentUser.products.includes(product._id)) {
        return next();
    } else {
        req.flash('error', 'You are not the authorized to perform this action');
        return res.redirect(`/products/${product.id}`);
    }
}

module.exports = isWinner;