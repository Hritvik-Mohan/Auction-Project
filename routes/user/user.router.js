/**
 * Node module imports
 */
const {
  Router
} = require("express");

/**
 * Model imports.
 */
const User = require("../../models/user.model");

/**
 * Utils import.
 */
const { upload } = require("../../utils/multer");

/**
 * Middleware Imports
 */
const protect = require("../../middlewares/protect");
const role = require("../../middlewares/role")
const isSeller = require("../../middlewares/isSeller");
const isTimeRemaining = require("../../middlewares/isTimeRemaining");
const isWinner = require("../../middlewares/isWinner");
const isVerified = require("../../middlewares/isVerified");
const isBidValid = require("../../middlewares/isBidValid");
const pagination = require("../../middlewares/pagination");

/**
 * Controller Imports
 */
const {
  getAllUsers,
  deleteUserById,
  getProfile,
  getProfileById,
  renderEditProfile,
  updateProfile,
  submitBid,
  renderSellerProfile,
  saveUserAddress,
  updateUserAddress
} = require("../../controllers/user/user.controller")

const {
  registerUser,
  sendVerificationOTP,
  verifyEmail,
  login,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword
} = require("../../controllers/user/auth.controller");

/**
 * Decalarations
 */
const UserRouter = Router();

/**
 * Routes
 */

// Get all users route.
UserRouter.route('/users')
  .get(protect, role.checkRole(role.ROLES.Admin), pagination(User), getAllUsers)
  .post(upload.single('avatar'), registerUser)

// Register a new user route.
UserRouter.route('/users/register')
  .get((req, res) => {
    res.render('users/register');
  })

// Verify user email
UserRouter.route('/users/verification')
  .get(protect, (req, res)=>{
    res.render('users/verify', {
      title: "Verify your email",
      action: "/users/verification"
    });
  })
  .post(protect, sendVerificationOTP)

UserRouter.route('/users/confirm')
  .get((req, res) => {
    res.render('users/confirmEmail');
  })
  .post(verifyEmail)

// User dashboard route.
UserRouter.route('/users/dashboard')
  .get(protect, (req, res) => {
    res.render('users/dashboard/dashboard', {
      user: res.locals.currentUser
    });
  })

// Dashboard my auctions.
UserRouter.route('/users/dashboard/my-auctions')
  .get(protect, (req, res)=>{
    res.render('users/dashboard/myAuctions', {
      user: res.locals.currentUser
    });
  })

// Dashboard my bids.
UserRouter.route('/users/dashboard/my-bids')
  .get(protect, (req, res)=>{
    res.render('users/dashboard/myBids', {
      user: res.locals.currentUser
    })
  })

// Add address route.
UserRouter.route("/users/addAddress")
  .get(protect, (req, res) => {
    res.render("users/addAddress")
  })
  .post(protect, saveUserAddress)
  .put(protect, updateUserAddress)

// Render edit address route.
UserRouter.route("/users/address/edit")
  .get(protect, (req, res) => {
    const user = req.user;
    const { billingAddress, shippingAddress } = user.address;
    
    if(billingAddress && shippingAddress){
      return res.render("users/editAddress", {
        billingAddress,
        shippingAddress
      });
    } else {
      return res.render("users/addAddress");
    }
  })


// Login a user route.
UserRouter.route('/users/login')
  .get((req, res) => {
    if(res.locals.currentUser) return res.redirect('/products');
    res.render('users/login');
  })
  .post(login)

// Logout a user route.
UserRouter.route('/users/logout')
  .get(protect, logout)

// Clear all tokens and logout from all the devices.
UserRouter.route('/users/logoutAll')
  .get(protect, logoutAll)

// Forgot password route.
UserRouter.route('/users/forgot-password')
  .get((req, res) => {
    return res.render('users/verify', {
      title: "Forgot Password",
      action: "/users/forgot-password"
    });
  })
  .post(forgotPassword)

// Reset password route.
UserRouter.route('/users/reset-password')
  .get((req, res) => {
    return res.render('users/resetPassword');
  })
  .post(resetPassword);

// Get logged in user's profile route.
UserRouter.route('/users/profile')
  .get(protect, getProfile)
  .put(protect, upload.single('avatar'), updateProfile)

// Edit logged in user's profile route.
UserRouter.route('/users/edit')
  .get(protect, renderEditProfile)

// Admin only accessible route to get all user and update a user.
UserRouter.route('/users/edit/:id')
  .get(protect, role.checkRole(role.ROLES.Admin), renderEditProfile)
  .put(protect, role.checkRole(role.ROLES.Admin), upload.single('avatar'), updateProfile)

// Admin only accessible route. Get user profile by id route. /users/user_id
UserRouter.route('/users/:id')
  .get(protect, role.checkRole(role.ROLES.Admin), getProfileById)
  .delete(protect, role.checkRole(role.ROLES.Admin), deleteUserById)

// Submit a bid route. /users/product_id/bid
UserRouter.route('/users/:id/bid')
  .post(protect, isVerified, isSeller, isTimeRemaining, isBidValid, submitBid);

// Contact seller route. /constactSeller/product_id
UserRouter.route('/contactSeller/:id')
  .get(protect, isWinner, renderSellerProfile);

module.exports = UserRouter;