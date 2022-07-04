/**
 * Module imports.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Model Imports.
 */
const User = require("./user.model");
const Bid = require("./bid.model");
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
  currentHighestBid: {
    amount: {
      type: Number
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    bid: {
      type: Schema.Types.ObjectId,
      ref: 'Bid'
    }
  },
  images: [imageSchema],
  startTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    enum: [3, 5, 7, 10], // numbers in days
    required: true
  },
  category: {
      type: String,
      required: true,
      enum:['art', 'antiques', 'vehicle', 'books', 'collectible', 'electronics', 'other'],
      trim: true
  },
  user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  bids: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Bid'
    }
  ],
  auctionStatus: {
    type: Boolean
  }
}, {
  timestamps: true
}, opts);

// Virtal function to compute the end time of the auction in ISOString.
productSchema.virtual('endTime').get(function(){
  const startTime = this.startTime;
  const startTimeInSeconds = new Date(startTime).getTime() / 1000;
  const endTimeInSeconds = startTimeInSeconds + this.duration * 24 * 60 * 60;
  const endTime = new Date(endTimeInSeconds * 1000);
  return endTime;
});

// Remove the product id from user.products array after deleting the product.
// Also delete all the bids associated with the product.
productSchema.post('findOneAndDelete', async function(deletedProduct, next){
  try{
    const user = await User.findById(deletedProduct.user);
    // await User.pull({ _id: user._id }, { products: deletedProduct._id });
    await Promise.all([
      Bid.deleteMany({_id: { $in: deletedProduct.bids}}),
      User.updateMany({}, {$pull: {bids: {$in: deletedProduct.bids}}}), 
      user.products.pull(deletedProduct._id),
    ]);
    await user.save();
    next();
  } catch(err){
    next(err);
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;