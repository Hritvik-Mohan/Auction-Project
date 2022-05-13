/**
 * Node module imports
 */
const {
    Router
} = require("express");
const stripe = require('stripe')(process.env.STRIPE_TEST_TOKEN);

/**
 * Middleware Imports
 */
const protect = require("../../middlewares/protect");
const isWinner = require("../../middlewares/isWinner");

/**
 * Controller Imports
 */
const {
    createPayment
} = require("../../controllers/stripe/stripe.controller")

/**
 * Decalarations
 */
const StripeRouter = Router();
const YOUR_DOMAIN = 'http://localhost:3000';

/**
 * Routes
 */

// Payment route

/**
 * Stripe Test Route
 */
app.post('/create-checkout-session',protect);


module.exports = StripeRouter;
