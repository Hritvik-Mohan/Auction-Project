const User = require("../models/user.model");
  import {
    verifyToken
  } from "../utils/jwt.js";
  import catchAsync from "../utils/catchAsync.js";
  /**
   * This function decode the bearer token and get the user
   * and assign it to req.user
   * 
   * @param {object} req request object
   * @param {object} res response object
   * @returns undefined
   */
  export const protect = catchAsync(async (req, res, next) => {
  
    const { authorization } = req.headers;
  
    if (!authorization) {
      return res.status(401).send({
        status: "failed",
        message: "User not authorized"
      });
    }
    let token = authorization.split("Bearer ")[1];
    if (!token) {
      return res.status(401).send({
        status: "failed",
        message: "Token not found"
      });
    }
    const payload = await verifyToken(token);
    const user = await User.findById(payload.id)
      .select("-password")
      .lean()
      .exec();
    if (!user) {
      return res.status(401).send({
        status: "failed",
        message: "User not found"
      });
    }
    console.log(user);
    req.user = user;
    next();
  });