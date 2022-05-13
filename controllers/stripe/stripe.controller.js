/**
 * Model imports.
 */
 const Product = require("../../models/product.model");
 const User = require("../../models/user.model");
 const Bid = require("../../models/bid.model");

/**
 * Utils imports.
 */
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");

/**
 * @description - Creates a payment session
 */
module.exports.createPayment = catchAsync(async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: '{{PRICE_ID}}',
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/success.html`,
        cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    res.redirect(303, session.url);
});
