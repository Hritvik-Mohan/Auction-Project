const mongoose = require("mongoose");
const userSchema = require('./schema/userSchema');

const auctionDB = process.env.MONGO_CONNECTION;

mongoose.connect(auctionDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Object       Collection Name
//     ⬇️                     ⬇️
const User = mongoose.model("user", userSchema);

module.exports = User;