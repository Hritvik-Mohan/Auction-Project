const mongoose = require("mongoose");
const bidsSchema = require("./bidsSchema")

// userDB schema
const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bids: [bidsSchema]
});

module.exports = userSchema;