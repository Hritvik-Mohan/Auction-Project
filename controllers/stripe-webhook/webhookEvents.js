/**
 * Model imports.
 */
const Transaction = require("../../models/transaction.model");

/**
 * Utils imports.
 */
const catchAsync = require("../../utils/catchAsync");

/**
 * @description - This function save the transaction information in the database.
 *       
 */
const createOrder = catchAsync(async (session) => {
    console.log(session);
    console.log("Save the order to the database");

    const { 
        product_id, 
        seller_id, 
        bidder_id, 
        bid_id, 
        amount 
    } = session.metadata;
   
    const transaction = new Transaction({
        product: product_id,
        bidder: bidder_id,
        seller: seller_id,
        bid: bid_id,
        amount: amount,
        stripeCustomerId: session.customer,
        stripePaymentIntentId: session.payment_intent,
    });

    await transaction.save();
});

/**
 * @description - This function updates the product status to "paid".
 *                and send an email to the customer with the transaction details.
 */
const fulfillOrder = catchAsync(async (session) => {
    console.log("Send the email to the buyer to confirm the order");
    
    const { 
        product_id, 
        seller_id, 
        bidder_id, 
    } = session.metadata;

    const transaction = await Transaction.findOne({
        product: product_id,
        bidder: bidder_id,
        seller: seller_id
    });

    transaction.paymentStatus = "paid";

    await transaction.save();

    //TODO: Send the email to the buyer to confirm the order
});

/**
 * @description - This function sends the email to the user in
 *                an event of failed payment.
 */
const emailCustomerAboutFailedPayment = catchAsync( async (session) => {
    //TODO:
    console.log("Send the email to the customer to inform them that the payment failed");
});

module.exports = {
    createOrder,
    fulfillOrder,
    emailCustomerAboutFailedPayment
}