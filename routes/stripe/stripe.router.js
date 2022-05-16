/**
 * Node module imports
 */
const {
    Router
} = require("express");

/**
 * Middleware Imports
 */
const protect = require("../../middlewares/protect");
const isWinner = require("../../middlewares/isWinner");
const isAuctionOver = require("../../middlewares/isAuctionOver");
const canCheckout = require("../../middlewares/canCheckout");

/**
 * Controller Imports
 */
const {
    createPayment,
} = require("../../controllers/stripe/stripe.controller")

/**
 * Decalarations
 */
const StripeRouter = Router();


/**
 * Routes
 */

// Payment route

/**
 * Stripe Test Route
 */
StripeRouter.route("/stripe/create-checkout-session/:id")
    .post(protect, isAuctionOver, isWinner, canCheckout, createPayment)


StripeRouter.route("/stripe/success")
    .get((req, res)=>{
        res.render("stripe/success")
    });

StripeRouter.route("/stripe/cancel")
    .get((req, res)=>{
        res.render("stripe/success")
    });

module.exports = StripeRouter;