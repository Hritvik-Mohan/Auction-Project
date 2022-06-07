/**
 * Node module imports
 */
const {
  Router
} = require("express");

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

/**
 * Controller Imports
 */
const {
  getAllUsers,
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
  .get(protect, role.checkRole(role.ROLES.Admin), getAllUsers)
  .post(upload.single('avatar'), registerUser)

// Register a new user route.
UserRouter.route('/users/register')
  .get((req, res) => {
    res.render('users/register');
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
    res.render("users/editAddress", {
      billingAddress,
      shippingAddress
    });
  })


// Login a user route.
UserRouter.route('/users/login')
  .get((req, res) => {
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
    return res.render('users/forgot-password');
  })
  .post(forgotPassword)

// Reset password route.
UserRouter.route('/users/reset-password')
  .get((req, res) => {
    return res.render('users/reset-password');
  })
  .post(resetPassword);

// Get logged in user's profile route.
UserRouter.route('/users/profile')
  .get(protect, getProfile)
  .put(protect, upload.single('avatar'), updateProfile)

// Edit logged in user's profile route.
UserRouter.route('/users/edit')
  .get(protect, renderEditProfile)

// Get user profile by id route. /users/user_id
UserRouter.route('/users/:id')
  .get(protect, getProfileById)

// Submit a bid route. /users/product_id/bid
UserRouter.route('/users/:id/bid')
  .post(protect, isSeller, isTimeRemaining, submitBid);

// Contact seller route. /constactSeller/product_id
UserRouter.route('/contactSeller/:id')
  .get(protect, isWinner, renderSellerProfile);

module.exports = UserRouter;