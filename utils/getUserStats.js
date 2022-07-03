const Product = require("../models/product.model");
const Bid = require("../models/bid.model");

const getStats = async (user) => {
    const productsListed = await Product.find({ _id: { $in: user.products } })
    // Check if any bids were made on the product
    const bidsMadeOnListedProducts = await Bid.find({ product: { $in: user.products } });
    // console.log('bidsMadeOnListedProducts', bidsMadeOnListedProducts);

    // Now finding the unsuccessful bids
    // 1. First get all the products whose auction status is false
    // 2. Then check if the startDate is smaller than the current date
    // 3. If yes, then check if any bids were made on the product
    // 4. If not, then list those products
    const unsuccessfulProducts = productsListed
        .filter(product => product.auctionStatus === false && product.startTime < new Date() && product.hasOwnProperty('currentHighestBid') === false);
    
    // console.log('unsuccessfulProducts', unsuccessfulProducts.length);

    const bids = await Bid.where('user').equals(user._id);
    const productIds = bids.map(bid => bid.product);

    // console.log(productIds);
    const products = await Product.find({ _id: { $in: productIds } })
        .where('auctionStatus')
        .equals(false)
    
    // console.log(`bids on product whose auction status is now false - `,products.length);
      
    const productsWon =  products.filter(product => {
        return product.currentHighestBid.user.toString() === user._id.toString();
    });

    console.log(productsWon.length);

    const bidCount = bids.length;
    const wonBids = user.bidsWon.length;
 
    console.log("Stats - My Bids______________________________");
    console.log("Bids:", bidCount);
    user.bids;
   
    console.log("Won Bids:", wonBids); // already on user object.
    console.log("Lost Bids:", products.length - wonBids);
    user.finishedAuctions = products;

    console.log("_____________________________________________");

    console.log("Stats - My Auctions______________________________");
    console.log("Total:", user.products.length);
    console.log("Active:", wonBids);
    console.log("Successful:", bidsMadeOnListedProducts.length);
    console.log("Unsuccessful:", unsuccessfulProducts.length);
    console.log("_____________________________________________");

    return 
}