const mongoose = require("mongoose");

const auctionDB = process.env.MONGO_CONNECTION;

mongoose.connect(auctionDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// userDB schema
const userSchema = new mongoose.Schema({
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
});

// User Object       Collection Name
//     ⬇️                     ⬇️
const User = mongoose.model("user", userSchema);

module.exports = User;