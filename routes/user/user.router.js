/**
 * Node module imports
 */
const {
  Router
} = require("express");
const multer = require('multer')
const {
  storage
} = require("../../utils/cloudinaryUpload");
const upload = multer({
  storage
})

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
  renderSellerProfile
} = require("../../controllers/user/user.controller")

const {
  registerUser,
  login,
  logout,
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

// Login a user route.
UserRouter.route('/users/login')
  .get((req, res) => {
    res.render('users/login');
  })
  .post(login)

// Logout a user route.
UserRouter.route('/users/logout')
  .get(logout)

// Forgot password route.
UserRouter.route('/users/forgot-password')
  .get((req, res)=>{
    return res.render('users/forgot-password');
  })
  .post(forgotPassword)

// Reset password route.
UserRouter.route('/users/reset-password')
  .get((req, res)=>{
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

// Get user profile by id route.
UserRouter.route('/users/:id')
  .get(protect, getProfileById)

// Submit a bid route.
UserRouter.route('/users/:productId/bid')
  .post(protect, isSeller, isTimeRemaining, submitBid);

// Contact seller route.
UserRouter.route('/contactSeller/:productId')
  .get(protect, isWinner, renderSellerProfile);

module.exports = UserRouter;