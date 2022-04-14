const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  basePrice: {
    type: Number,
    trim: true
  },
  images: [{
    type: String,
    trim: true,
  }],
  startTime: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    enum: [3, 5, 7, 10], // numbers in days
    required: true
  },
  category: {
      type: String,
      required: true,
      enum:['art', 'antiques', 'vehicle', 'books', 'collectible', 'other'],
      trim: true
  },
  user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
  }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product;