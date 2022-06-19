/**
 * @description - This middleware check if the entered bid
 * is a valid bid or not.
 * 
 * @param {object} req - request object
 * @param {object} res - response object 
 * @param {fuction} next - next function 
 */
const isBidValid = (req, res, next) => {

    const product = req.product;
    const { amount } = req.body;

    if (!amount) {
        req.flash("error", "Please enter a bid amount!");
        return res.redirect(`/products/${product._id}`);
    };

    if (product.currentHighestBid.amount) {
        if (amount > product.currentHighestBid.amount && amount <= ( product.currentHighestBid.amount * 2)) {
            return next();
        } else {
            req.flash("error", `Bid must be in range ${product.currentHighestBid.amount} > Your bid <= ${product.currentHighestBid.amount * 2}`);
            return res.redirect(`/products/${product._id}`);
        }
    } else {
        if(amount > product.basePrice && amount <= ( product.basePrice * 2 )){
            return next();
        } else {
            req.flash("error", `Bid must be in range ${product.basePrice} > Your bid <= ${product.basePrice * 2}`);
            return res.redirect(`/products/${product._id}`);
        }
    }
}

module.exports = isBidValid;