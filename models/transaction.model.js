const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bid : {
        type: Schema.Types.ObjectId,
        ref: "Bid",
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
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