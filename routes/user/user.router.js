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

/**
 * Model Imports
 */
const User = require("../../models/user.model");

/**
 * Controller Imports
 */
const {
  getAllUsers,
  getProfile,
  getProfileById,
  renderEditProfile,
  updateProfile
} = require("../../controllers/user/user.controller")
const {
  registerUser,
  login,
  logout,
  forgotPassword,
  resetPassword
} = require("../../controllers/user/auth.controller")

/**
 * Decalarations
 */
const UserRouter = Router();

/**
 * Routes
 */
UserRouter.route('/users')
  .get(protect, role.checkRole(role.ROLES.Admin), getAllUsers)
  .post(upload.single('avatar'), registerUser)

UserRouter.route('/users/register')
  .get((req, res) => {
    res.render('users/register');
  })

UserRouter.route('/users/login')
  .get((req, res) => {
    res.render('users/login');
  })
  .post(login)

UserRouter.route('/users/logout')
  .get(logout)


UserRouter.route('/users/profile')
  .get(protect, getProfile)
  .put(protect, upload.single('avatar'), updateProfile)

UserRouter.route('/users/edit')
  .get(protect, renderEditProfile)

UserRouter.route('/users/:id')
  .get(protect, getProfileById)


module.exports = UserRouter;