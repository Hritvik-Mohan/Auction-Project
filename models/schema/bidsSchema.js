const mongoose = require("mongoose");

// userDB schema
const bidsSchema = new mongoose.Schema({
    product_id: String,
    bid_amount: Number
});

module.exports = bidsSchema;