/**
 * Model imports.
 */
const User = require("../../models/user.model");
const Bid = require("../../models/bid.model");
const Product = require("../../models/product.model");

/**
 * Utils imports.
 */
const catchAsync = require("../../utils/catchAsync")
const { cloudinary } = require("../../utils/cloudinaryUpload");
const AppError = require("../../utils/AppError")

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

    // 4. If the email or phone number was updated then...
    if(query.$set.email || query.$set.phoneNumber){
        const { email, phoneNumber } = query.$set;
        // 4.1. Check if the email or phone number is already taken
        const existingUser = await User.findOne({
            $or: [{
                email
              }, //Check if this matches
              {
                phoneNumber
              } // OR this matches
            ]
          });

        if (existingUser) {
            req.flash('error', 'Make sure the new email or phone number is unique.');
            return res.redirect('/users/edit');
        }
    }

    // 5. Finally updating the user.
    await User.findByIdAndUpdate(user._id, query);

    res.redirect(`/users/profile`);
})

module.exports.submitBid = catchAsync(async (req, res) => {
    // 1. Get the current user.
    const user = req.user;

    // 2. Get the product id.
    const {
        productId
    } = req.params;

    // 3. Get the bid amount.
    const {
        amount
    } = req.body;

    // 4 . If the amount was not provided then throw an error.
    if(!amount) throw new AppError('Please enter a bid amount', 400);
    
    // 5. Find the product.
    const product = await Product.findById(productId);

    // 6. If the product is not found then throw an error.
    if(!product) throw new AppError('Product not found', 404);

    // 7. If the product has currentHighestBid property then..
    if(product.currentHighestBid){
        console.log("check");
        // 7.1. If the currentHighestBid is less than the bid amount then throw an error.
        if(amount < product.currentHighestBid.amount) throw new AppError('Bid amount must be greater than the current highest bid', 400);
    }

    // 8. Check if the user has already bid on this product.
    const existingBid = await Bid.findOne({
        user: user._id,
        product: productId
    })
    // 8.1 If user has already bid on this product then update the bid amount
    if(existingBid){
        existingBid.amount = amount;
        product.currentHighestBid.amount = amount;
        product.currentHighestBid.user = user._id;

        await Promise.all([existingBid.save(), product.save()]);

        return res.redirect(`/products/${productId}`);
    }

    // 9. If user has not bid on this product then create a new bid.
    const bid = new Bid({
        user: user._id,
        product: productId,
        amount
    });

    // 10. Update the currentHighestBid property of the product.
    product.currentHighestBid.amount = amount;
    product.currentHighestBid.user = user._id;

    // 11. Associate the bid with the product and the user.
    product.bids.push(bid._id);
    user.bids.push(bid._id);

    // 12. Save the bid, product and user.
    await Promise.all([bid.save(), product.save(), user.save()]);
  
    return res.redirect(`/products/${productId}`);
});