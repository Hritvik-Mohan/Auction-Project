const mongoose = require("mongoose");

/**
 * @description: Connect to the database by providing the connection string.
 * @param {String} uri | MongoDB URI
 * @default: mongodb://localhost:27017/auctionDB
 *
 * @returns {undefined}
 */
const connectDb = (url = process.env.MONGODB_LOCAL_CONNECTION) => {
    try {
      const con = mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      if(con) console.log("✅ MongoDB connected...")
    } catch(e){
      console.log(`❌ Error connecting mongodb: ${e}`);
    }
};  

module.exports = connectDb;