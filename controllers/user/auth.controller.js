/**
 * Node modules.
 */
const validator = require("validator");

/**
 * Utils imports
 */
const catchAsync = require("../../utils/catchAsync");
const emailTemplate = require("../../utils/emailTemplate");
const sendMail = require("../../utils/nodemailer")
const { newToken } = require("../../utils/jwt");
const { dateEighteenYearsAgo } = require("../../utils/misc.functions");
const { cloudinary } = require("../../utils/cloudinaryUpload");

/**
 * Models Imports.
 */
const User = require("../../models/user.model");

/**
 * This function Registers a new user
 *
 * @param {object} req contains object of data required for registration
 * @param {object} res response object
 * @returns {undefined}
 */
module.exports.registerUser = catchAsync(async (req, res) => {
  
  // 1. Get user data
  const { email, firstName, lastName, password, phoneNumber, dob } = req.body;

  // 2. Check if all the fields are filled.
  if(!email || !firstName || !lastName || !password || !phoneNumber || !dob) {
    await cloudinary.uploader.destroy(req.file.filename);
    req.flash("error", "Please fill all the fields");
    return res.redirect("/users/register");
  }

  // 2.1 Validate the data received.
  if(!validator.isEmail(email)) {
    await cloudinary.uploader.destroy(req.file.filename);
    req.flash("error", "Please enter a valid email");
    return res.redirect("/users/register");
  }

  if(!validator.isMobilePhone(phoneNumber, "en-IN")) {
    await cloudinary.uploader.destroy(req.file.filename);
    req.flash("error", "Please enter a valid phone number");
    return res.redirect("/users/register");
  }

  if(!validator.isBefore(dob, dateEighteenYearsAgo())){
    await cloudinary.uploader.destroy(req.file.filename);
    req.flash("error", "Age should be 18 years or older");
    return res.redirect("/users/register");
  }

  if(!validator.isLength(password, { min: 6, max: 20 })) {
    await cloudinary.uploader.destroy(req.file.filename);
    req.flash("error", "Password should be between 8 and 20 characters");
    return res.redirect("/users/register");
  }

  // 3. Check if profile picture is uploaded.
  if(!req.file) {
    req.flash("error", "Please upload a profile picture");
    return res.redirect("/users/register");
  }


  const { 
     path,
     filename
  } = req.file;

  const avatar = {
    path,
    filename
  }

  // Default role
  const role = "ROLE_USER";

  // 5. Check if user exists with phone or email
  const existingUser = await User.findOne({
    $or: [
      {
        email,
      }, //Check if this matches
      {
        phoneNumber,
      }, // OR this matches
    ],
  });

  if (existingUser) {
    req.flash("error", "An account already exists, head to login");
    return res.redirect("/users/login");
  }

  

  const user = new User({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    dob,
    avatar,
    role,
  });

  const token = newToken(user._id);
  user.tokens.push({ token });
  await user.save();

  // Setting the token in cookies
  res.cookie("token", token, { signed: true });
  req.flash("success", "Welcome to Auction App");

  // return res.redirect("/products");
  return res.render("users/verify", {
    title: "Verify your email",
    action: "/users/verification"
  })
});

/**
 * @description - This function is used to verify the user's email by generating
 *                a otp and sending it to the user's email.
 *
 * @param {object} req - contains email and otp
 * @param {object} res - response object
 * @returns undefined
 */
module.exports.verifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const html = emailTemplate(otp);
  const info = await sendMail(email, "Verify your email", html);

  if(!info){
    req.flash("error", "Couldn't send mail. Try again later.")
    return res.redirect("/users/verification")
  }

  // 6. Sending the response
  req.flash("success", "OTP sent to your mail");
  return res.render('/users/confirm', {
    action: ""
  })
});

/**
 * This login function checks if the user exists, if yes then
 * checks if the password verifies to the hash. If matched provides a JWT Token
 *
 * @param {object} req contains email and password
 * @param {object} res response object
 * @returns undefined
 */
module.exports.login = catchAsync(async (req, res) => {

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send({
      message: "email and password are required",
    });

  const user = await User.findOne({ email }).exec();

  if (!user) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/users/login");
  }

  const match = await user.checkPassword(password);
  if (!match) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/users/login");
  }

  const token = newToken(user._id);
  user.tokens.push({ token });
  await user.save();


  // Setting the token to the cookies for identifying signed user
  res.cookie("token", token, { signed: true });
  req.flash("success", "Welcome to Auction App");
  
  // ! Bug ------------------------------------------------
  // Redirecting to the previous page
  const redirectTo = req.session.returnTo || "/products";
  delete req.session.redirectTo;
  // ------------------------------------------------------

  return res.redirect("/products");
});

/**
 * This logout function clears the jwt token from cookie and hence
 * logs him out.
 *
 * @param {object} req contains email and password
 * @param {object} res response object
 * @returns undefined
 */
module.exports.logout = catchAsync(async (req, res) => {
  res.clearCookie("token");

  req.user.tokens = req.user.tokens.filter((token) => token.token != req.token);
  await req.user.save();

  req.flash("success", "Logged you out. See you again !");
  return res.redirect("/products");
});

module.exports.logoutAll = catchAsync(async (req, res)=>{
  res.clearCookie("token");

  req.user.tokens = [];
  await req.user.save();

  req.flash("success", "Logged you out of all the devices.");
  return res.redirect("/products");
})

/**
 * This login function checks if the user exists, if yes then
 * generates a otp and saves it to user db then sends the reset
 * password link to the user email with the otp
 *
 * @param {object} req contains email
 * @param {object} res response object
 * @returns undefined
 */
module.exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    req.flash("error", "Email is required");
    return res.redirect("/users/forgot-password");
  }

  // 1. Finding the user with that email.
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "Email is not registered");
    return res.redirect("/users/forgot-password");
  }

  // 2. Generating a 6 digit random number for otp
  const otp = Math.floor(100000 + Math.random() * 900000);

  // 3. Setting the generated otp to the users otp property
  user.otp = otp;

  // 4. Save the user
  await user.save();
  // 5. Sending the otp to the user's email.
  const html = emailTemplate(otp);
  const info = await sendMail(email, "Reset Passoword", html);

  if(!info){
    req.flash("error", "Couldn't send mail. Try again later.")
    return res.redirect("/users/forgot-password")
  }

  // 6. Sending the response
  req.flash("success", "OTP sent to your mail");
  return res.redirect('/users/reset-password')

});

/**
 * This reset password function checks the email and otp
 * received from the user and if matched then changes the password
 * and sends email to the user with the new password
 *
 * @param {object} req contains email and otp
 * @param {object} res response object
 * @returns undefined
 */
module.exports.resetPassword = catchAsync(async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp ||!password) {
    req.flash("error", "All fields are required");
    return res.redirect("/users/reset-password");
  }

  // 1. Finding the user with that email.
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "Incorrect email");
    return res.redirect("/users/reset-password");
  }

  // 2. Checking if the otp matches the one in the database
  const result = await user.checkOTP(otp);
  if (!result) {
    req.flash("error", "Invalid OTP");
    return res.redirect("/users/reset-password");
  }

  // 5. Save the new password to the user database
  user.password = password;

  // 6. Clear the otp field from the user database
  user.otp = "";

  // 7. Clear all the tokens from the user database.
  user.tokens = [];

  // 8. Save the user
  await user.save();

  // 8. Sending the response
  req.flash("success", "Password reset successfully");
  return res.redirect("/users/login");
});