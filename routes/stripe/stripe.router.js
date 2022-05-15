/**
 * Node module imports
 */
const {
    Router
} = require("express");
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_TEST_TOKEN);

/**
 * Middleware Imports
 */
const protect = require("../../middlewares/protect");
const isWinner = require("../../middlewares/isWinner");
const isAuctionOver = require("../../middlewares/isAuctionOver");

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
    .post(protect, isAuctionOver, isWinner, createPayment)


StripeRouter.route("/stripe/success")
    .get((req, res)=>{
        res.render("stripe/success")
    });

StripeRouter.route("/stripe/cancel")
    .get((req, res)=>{
        res.render("stripe/success")
    });

module.exports = StripeRouter;