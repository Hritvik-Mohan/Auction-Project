/**
 * Node module imorts.
 */
const {
    Router
} = require("express");

/**
 * Middleware import
 */
const protect = require("../../../middlewares/protect");
const isVerified = require("../../../middlewares/isVerified");

/**
 * Router object.
 */
const ProductRouterV2 = Router();

/**
 * Get product and add product route.
 */
ProductRouterV2.route('/users/dashboard/create-auction')
    .get(protect, isVerified, (req, res) => {
        res.render('products/new');
    })

module.exports = ProductRouterV2;