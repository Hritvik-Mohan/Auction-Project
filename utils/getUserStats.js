const Product = require("../models/product.model");
const Bid = require("../models/bid.model");

/**
 * @description - This function computes all the stats of the user.
 * 
 * @param {Object} user - The user object.
 * @returns {Object} user - The user object with the stats.
 */

const getUserStats = async (user) => {
    const currentUser = {
        ...user._doc
    };
   
    const productsListed = await Product.find({ _id: { $in: user.products } })

    // Check if any bids were made on the product
    const successfulProducts = await Bid.find({ product: { $in: user.products } })
        .populate('product');

    // Now finding the unsuccessful bids
    // 1. First get all the products whose auction status is false
    // 2. Then check if the startDate is smaller than the current date
    // 3. If yes, then check if any bids were made on the product
    // 4. If not, then list those products
    const unsuccessfulProducts = productsListed
        .filter(product => product.auctionStatus === false && product.startTime < new Date() && product.hasOwnProperty('currentHighestBid') === false);
    
    // Finding the live auctions.
    const liveAuctions = productsListed.filter(product => product.auctionStatus === true);
    
    // Finding the bids made by the user.
    const bidsDetail = await Bid.where('user').equals(user._id).populate("product");

    // Finding detail of bidsWon
    const bidsWonDetail = await Bid.find({ _id: { $in: user.bidsWon } }).populate("product");

    // Getting an array of product ids from the bidsDetail.
    const productIds = bidsDetail.map(bid => bid.product);

    // Finding those products in productsIds whose auction status is false.
    const products = await Product.find({ _id: { $in: productIds } })
        .where('auctionStatus')
        .equals(false)
    
    // Getting the list of auctions that user lost.
    const bidsLost = products.filter(product => product.currentHighestBid.user.toString() !== user._id.toString());
 
    // Details of bids made on the products by the user.
    currentUser.bidsDetail = bidsDetail;

    // Detail of bids won by the user
    currentUser.bidsWonDetail = bidsWonDetail;

    // Contains array of products that user lost bids on.
    currentUser.bidsLost = bidsLost;

    // Detail of products on which user has placed bid. 
    // The auction status of these products are false (meaning auction is over).
    currentUser.bidsOnProducts = products;

    // Array of products listed by the user which are currently running.
    currentUser.liveAuctions = liveAuctions;

    // Array of products listed by user on which other users have placed bid on.
    currentUser.successfulProducts = successfulProducts;

    // Array of products listed by user on which 0 bids were placed.
    currentUser.unsuccessfulProducts = unsuccessfulProducts;

    return currentUser;
}

module.exports = getUserStats;