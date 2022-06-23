/**
 * Model imports.
 */
const Transaction = require("../../models/transaction.model");
const User = require("../../models/user.model");
const Product = require("../../models/product.model");

/**
 * Util import.
 */
const sendMail = require("../../utils/nodemailer");

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
    try {
        const { 
            product_id, 
            seller_id, 
            bidder_id, 
        } = session.metadata;

        const [ user, product, transaction ] = await Promise.all([
            User.findById(bidder_id),
            Product.findById(product_id),
            Transaction.findOne({
                product: product_id,
                bidder: bidder_id,
                seller: seller_id
            })
        ]);

        transaction.paymentStatus = "paid";

        await transaction.save();

        const info = await sendMail(
            user.email,
            "Payment Successful",
            `Your payment of ${product.currentHighestBid.amount}₨ for the product ${product.title} has been successful.
             Your order is confirmed.
            `
        );
        if(info) console.log(info)
        else console.log("Email not sent");

    } catch (e) {
        console.log(e);
    }
};

/**
 * @description - This function sends the email to the user in
 *                an event of failed payment.
 */
const emailCustomerAboutFailedPayment =  async (session) => {
    try {
        const { 
            product_id, 
            seller_id, 
            bidder_id, 
        } = session.metadata;

        const [ user, product, transaction ] = await Promise.all([
            User.findById(bidder_id),
            Product.findById(product_id),
            Transaction.findOne({
                product: product_id,
                bidder: bidder_id,
                seller: seller_id
            })
        ]);

        transaction.paymentStatus = "unpaid";

        await transaction.save();

        const info = await sendMail(
            user.email,
            "Payment Unsuccessful",
            `Your payment of ${product.currentHighestBid.amount}₨ for the product ${product.title} was unsuccessful.
             Please try again.
            `
        );
        if(info) console.log(info)
        else console.log("Email not sent");

    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    createOrder,
    fulfillOrder,
    emailCustomerAboutFailedPayment
}