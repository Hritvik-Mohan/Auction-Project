const mongoose = require("mongoose");

const auctionDB = process.env.MONGO_CONNECTION;

mongoose.connect(auctionDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// userDB schema
const productSchema = new mongoose.Schema({

  //TODO

});

//  Product Object       Collection Name
//      ⬇️                     ⬇️
const Product = mongoose.model("product", productSchema);

module.exports = Product;