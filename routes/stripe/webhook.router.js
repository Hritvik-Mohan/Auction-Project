/**
 * Node module imports
 */
const {
    Router
} = require("express");
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_TEST_TOKEN);

/**
 * Declarations
 */
const WebhookRouter = Router();

/**
 * Controller Imports
 */
const { webhookHandler } = require("../../controllers/stripe-webhook/webhook.controller")

/**
 * Webhook route
 */
WebhookRouter.route("/stripe/webhook")
    .post(bodyParser.raw({ type: "application/json" }), webhookHandler)

module.exports = WebhookRouter;