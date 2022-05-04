const mongoose = require("mongoose");
const SECRETS = require("../configs/config");

/**
 * @description: Connect to the database by providing the connection string.
 * @param {String} uri | MongoDB URI
 * @default: mongodb://localhost:27017/auctionDB
 *
 * @returns {undefined}
 */
const connectDb = (url = SECRETS.MOGODB_LOCAL_CONNECTION) => {
    try {
      const con = mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      if(con) console.log("MongoDB connected...")
    } catch(e){
      console.log(`Error: ${e}`);
    }
};  

module.exports = connectDb;