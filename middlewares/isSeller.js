/**
 * @description - This middleware checks if the logged in user is the seller of the 
 *                the product or not.
 * 
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next function
 * @returns next() | if user is the seller
 * @returns res.redirect('/products/:productId') | if user is not the seller
 */
const isSeller = (req, res, next) => {
    // 1. Get user
    const user = req.user;

    // 2. Get product data.
    const {
        id: productId
    } = req.params;
   
    // 3. Check if the user is the owner of the product.
    if (user.products.includes(productId)) {
        req.flash('error', 'You cannot place bid on your own product.');
        return res.redirect(`/products/${productId}`);
    }

    return next();
}

module.exports = isSeller;