const isAuthorized = (req, res, next) => {

    // 1. Get user
    const user = req.user;

    // 2. Get product data.
    const {
        id: productId
    } = req.params;

    // 3. Check if the user is the owner of the product.
    if (user.products.includes(productId)) {
        return next();
    }

    // 4. If not, flash the message, 'You are not authorized'.
    req.flash('error', 'You are not authorized.');

    // 5. Redirect to the products page.
    return res.redirect('/products');
}

module.exports = isAuthorized;