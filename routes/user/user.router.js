/**
 * Node module imports
 */
const {
  Router
} = require("express");

/**
 * Middleware Imports
 */
const protect = require("../../middlewares/protect");
const role = require("../../middlewares/role")

/**
 * Utils Import
 */
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");

/**
 * Model Imports
 */
const User = require("../../models/user.model");

/**
 * Controller Imports
 */
const {
  getAllUsers,
  getProfile
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
  .post(registerUser)

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
   // req.headers.authorization = value;
  .get(protect, getProfile)
  .put(
    catchAsync(async (req, res) => {

      // * Setting a default image if user did not
      // * set his own image
      req.body.user.image = req.body.user.image.length === 0 ?
        'https://i.imgur.com/FPnpMhC.jpeg' :
        req.body.user.image;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body.user, {
          new: true,
          runValidators: true
        }
      );
      console.log(updatedUser);
      res.redirect(`/users/${updatedUser._id}`);
    }))
  .delete(catchAsync(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  }))

UserRouter.route('/users/:id/edit')
  .get(catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new AppError('Not Found', 404);
    }

    res.render('users/edit', {
      user
    })
  }))

module.exports = UserRouter;