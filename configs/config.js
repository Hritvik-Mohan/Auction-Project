const MongoStore = require("connect-mongo");

module.exports.sessionConfig = {
    secret: process.env.SIGN_COOKIE,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly : true,
      expires  : Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: MongoStore.create({
      mongoUrl: process.env.NODE_ENV === "production" ? process.env.MONGODB_CONNECTION_STRING : process.env.MONGODB_LOCAL_CONNECTION,
      touchAfter: 24 * 60 * 60
    })
}