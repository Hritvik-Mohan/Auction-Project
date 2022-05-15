/**
 * Node Modules
 */
const stripe = require('stripe')(process.env.STRIPE_TEST_TOKEN);


/**
 * Model imports.
 */
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Bid = require("../../models/bid.model");
const Transaction = require("../../models/transaction.model");

/**
 * Utils imports.
 */
const catchAsync = require("../../utils/catchAsync");
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Webhook events imports.
 */
// const { fulfillOrder } = require("./webhookEvents");

const createOrder = async (session) => {
    console.log(session);
    console.log("Save the order to the database");
    const transaction = new Transaction({
        product: session.metadata.product_id,
        bidder: session.metadata.user_id,
        seller: session.metadata.seller_id,
        bid: session.metadata.bid_id,
        amount: session.metadata.amount,
        stripeCustomerId: session.customer,
        stripePaymentIntentId: session.payment_intent,
    });

    await transaction.save();
}

const fulfillOrder = async (session) => {
    console.log("Send the email to the buyer to confirm the order");
    const transaction = await Transaction.findOne({
        product: session.metadata.product_id,
        bidder: session.metadata.user_id,
        seller: session.metadata.seller_id
    });

    transaction.paymentStatus = "paid";

    await transaction.save();

    //TODO: Send the email to the buyer to confirm the order
}

const emailCustomerAboutFailedPayment = session => {
    //TODO:
    console.log("Send the email to the customer to inform them that the payment failed");
}

/**
 * Webhook handler function.
 */
module.exports.webhookHandler = catchAsync(async (req, res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        console.log(err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            // Save an order in your database, marked as 'awaiting payment'
            await createOrder(session);

            // Check if the order is paid (for example, from a card payment)
            //
            // A delayed notification payment will have an `unpaid` status, as
            // you're still waiting for funds to be transferred from the customer's
            // account.
            if (session.payment_status === 'paid') {
                await fulfillOrder(session);
            }

            break;
        }

        case 'checkout.session.async_payment_succeeded': {
            const session = event.data.object;

            // Fulfill the purchase...
            fulfillOrder(session);

            break;
        }

        case 'checkout.session.async_payment_failed': {
            const session = event.data.object;

            // Send an email to the customer asking them to retry their order
            emailCustomerAboutFailedPayment(session);

            break;
        }
    }
    res.status(200).send({
        received: true
    })
});