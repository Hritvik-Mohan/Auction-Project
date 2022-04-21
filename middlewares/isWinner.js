const isWinner = (req, res, next) => {
    const currentUser = req.user;
    const product = req.product;

    if (currentUser._id.equals(product.currentHighestBid.user) && !currentUser.products.includes(product._id)) {
        console.log("You are the winner");
        return next();
    } else {
        req.flash('error', 'You are not the winner');
        return res.redirect(`/products/${product.id}`);
    }
}

module.exports = isWinner;