/**
 * Node Modules
 */
const stripe = require('stripe')(process.env.STRIPE_TEST_TOKEN);

/**
 * Utils imports.
 */
const catchAsync = require("../../utils/catchAsync");
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Webhook events imports.
 */
const { 
    createOrder, 
    fulfillOrder, 
    emailCustomerAboutFailedPayment 
} = require("./webhookEvents");

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