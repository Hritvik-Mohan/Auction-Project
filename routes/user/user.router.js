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
 * Utils Import
 */
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");
const { cloudinary } = require("../../utils/cloudinaryUpload");
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
  // req.headers.authorization = value;
  .get(protect, getProfile)
  .put(
    protect,
    upload.single('avatar'),
    catchAsync(async (req, res) => {

      // 1. Getting the current user.
      const user = req.user;

      // 2. Based on input from the edit from setting the fields to update.
      let query = { $set: {} };
      for (let key in req.body){
        if(user[key] && user[key] !== req.body[key]){
          query.$set[key] = req.body[key];
        }
      }

      // 3. If user has update profile pic then...
      if(req.file){
        // 3.1. Delete the previous avatar from cloudinary before adding a new one
        // await cloudinary.uploader.destroy(req.file.filename)
        const prevAvatarFilename = req.user.avatar.filename;
        await cloudinary.uploader.destroy(prevAvatarFilename);
        // 3.2. Add the new avatar cloudinary path to the user object
        query.$set.avatar = {
          path: req.file.path,
          filename: req.file.filename
        }
      }

      // 4. Finally updating the user.
      await User.findByIdAndUpdate(user._id, query);

      res.redirect(`/users/profile`);
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