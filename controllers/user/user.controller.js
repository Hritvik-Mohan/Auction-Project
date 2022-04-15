/**
 * Model imports.
 */
const User = require("../../models/user.model");

/**
 * Utils imports.
 */
const catchAsync = require("../../utils/catchAsync")
const { cloudinary } = require("../../utils/cloudinaryUpload");

/**
 * Get list of all the users.
 */
module.exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find({});
    res.status(200).send(users)
});

/**
 * Get the profile of logged in user.
 */
module.exports.getProfile = catchAsync(async (req, res) => {
    const user = await User.findById(res.locals.currentUser).populate('products', '_id , title');
 
    return res.render("users/profile", {
        user
    })
});

/**
 * Get public profile of a particular user based on its id.
 */
module.exports.getProfileById = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const user = await User.findById(id).populate('products', '_id , title');

    if (!user) {
        throw new AppError('Not Found', 404);
    }

    return res.render(`users/view`, {
        user
    });

});

/**
 * Renders edit profile page for current user
 */
module.exports.renderEditProfile = (req, res)=>{
    const user = req.user;
    res.render('users/edit', { user });
};

/**
 * Update the profile of the logged in user.
 */
module.exports.updateProfile = catchAsync(async (req, res) => {

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
})