const mongoose = require("mongoose");
const transactionSchema = require('./schema/transactionSchema');

const auctionDB = process.env.MONGO_CONNECTION;

mongoose.connect(auctionDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Transactions Schema
const transactionSchema = new mongoose.Schema({

  // TODO

});

//     Transaction Object        Collection Name
//         ⬇️                          ⬇️
const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = Transaction;