const isSeller = (req, res, next) => {
    // 1. Get user
    const user = req.user;

    // 2. Get product data.
    const {
        productId
    } = req.params;
    // console.log(user.products.includes(productId));
    // 3. Check if the user is the owner of the product.
    if (user.products.includes(productId)) {
        req.flash('error', 'Lol, you cannot bid on your own product.');
        return res.redirect(`/products/${productId}`);
    }

    return next();
}

module.exports = isSeller;