const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } }

const imageSchema = new Schema({
    path: {
        type: String,
        trim: true
    },
    filename: {
        type: String,
        trim: true
    }

}, opts)

imageSchema.virtual('thumbnail').get(function(){
  return this.path.replace('/upload', '/upload/w_200');
});

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
    trim: true,
    required: true
  },
  images: [imageSchema],
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