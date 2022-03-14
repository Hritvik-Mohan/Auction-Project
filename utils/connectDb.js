const mongoose = require("mongoose");
const SECRETS = require("../configs/config");

const connectDb = (url = SECRETS.MOGODB_LOCAL_CONNECTION) => {
    return mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
};  

module.exports = connectDb;