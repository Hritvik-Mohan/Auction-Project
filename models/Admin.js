const mongoose = require("mongoose");
const adminSchema = require('./schema/adminSchema');

const auctionDB = process.env.MONGO_CONNECTION;

mongoose.connect(auctionDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// userDB schema
const adminSchema = new mongoose.Schema({
  firstName: {
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

  bids: []
});

// Admin object          Collection Name
//     ⬇️                       ⬇️
const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;