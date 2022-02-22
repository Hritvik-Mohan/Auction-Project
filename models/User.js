const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bidsSchema = new Schema({
  productId: {
    type: mongoose.ObjectId,
    trim: true,
    required: true
  },
  bidAmout: {
    type: Number,
    required: true
  }
})

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
      type: String,
      required: true,
      trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true,
    default:'https://i.imgur.com/FPnpMhC.jpeg',
  },
  bids: {
    type: [bidsSchema]
  }
})

const User = mongoose.model('user', userSchema)

module.exports = User;