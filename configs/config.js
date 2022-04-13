const SECRETS = {
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_CONNECTION_STRING : process.env.MONGODB_CONNECTION_STRING,
    MOGODB_LOCAL_CONNECTION: process.env.MOGODB_LOCAL_CONNECTION,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXP: process.env.JWT_EXP,
    PASS_CODE: process.env.PASS_CODE,
    SIGN_COOKIE: process.env.SIGN_COOKIE
};

module.exports = SECRETS;