const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    bidder: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    seller:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bid : {
        type: Schema.Types.ObjectId,
        ref: "Bid",
    },
    amount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid"
    },
    stripeCustomerId : {
        type: String
    },
    stripePaymentIntentId : {
        type: String
    }
},{
    timestamps: true
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;