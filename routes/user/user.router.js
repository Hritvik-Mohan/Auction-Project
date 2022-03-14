/**
 * Node module imports
 */
const {
  Router
} = require("express");

/**
 * Middleware Imports
 */
const validateAge = require("../../middlewares/validateAge");
const validateUser = require("../../middlewares/validateUser");

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
  getAllUsers
} = require("../../controllers/user/user.controller")
const {
  register,
  signin,
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
  .get(getAllUsers)
  .post(register)

UserRouter.route('/users/register')
  .get((req, res) => {
    res.render('users/register');
  })

UserRouter.route('/users/login')
  .get((req, res) => {
    res.render('users/login');
  })
  .post(signin)


UserRouter.route('/users/:id')
  .get(catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new AppError('Not Found', 404);
    }

    res.render('users/profile', {
      user
    });
  }))
  .put(
    validateAge,
    validateUser,
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