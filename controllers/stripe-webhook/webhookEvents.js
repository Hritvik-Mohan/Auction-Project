/**
 * Model imports.
 */
const Transaction = require("../../models/transaction.model");

/**
 * @description - This function save the transaction information in the database.
 *       
 */
const createOrder = async (session) => {
    console.log(session);
    console.log("Save the order to the database");

    const { 
        product_id, 
        seller_id, 
        bidder_id, 
        bid_id, 
        amount 
    } = session.metadata;

   // Check if the transaction already exists
    const existingTransaction = await Transaction.findOne({
        product: product_id,
        bidder: bidder_id,
        seller: seller_id,
        bid: bid_id
    });
    
    // If the transaction already exists, then update the stripeCustomerId and stripePaymentIntentId.
    // Otherwise, create a new transaction.
    if (existingTransaction) {
        existingTransaction.stripeCustomerId = session.customer;
        existingTransaction.stripePaymentIntentId = session.payment_intent;
        await existingTransaction.save();
    } else {
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
    }
}

/**
 * @description - This function updates the product status to "paid".
 *                and send an email to the customer with the transaction details.
 */
const fulfillOrder = async (session) => {
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
};

/**
 * @description - This function sends the email to the user in
 *                an event of failed payment.
 */
const emailCustomerAboutFailedPayment =  async (session) => {
    //TODO:
    console.log("Send the email to the customer to inform them that the payment failed");
};

module.exports = {
    createOrder,
    fulfillOrder,
    emailCustomerAboutFailedPayment
}