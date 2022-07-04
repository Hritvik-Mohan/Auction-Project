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
const AppError = require("../../utils/AppError");

/**
 * @description - Get list of all the users.
 */
module.exports.getAllUsers = catchAsync(async (req, res) => {

  const model = req.model;
  const { limit, startIndex } = req.paginationParams;

  const users = await model.find()
      .limit(limit)
      .skip(startIndex);

  if(!users){
    req.flash('error', 'No users found');
    res.redirect('/');
  }

  return res.render("users/allUsers", { users })
});

/**
 * @description - Deletes the user by id.
 * @param {req} - request object
 * @param {res} - response object
 */
module.exports.deleteUserById = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  if (user.role === 'ROLE_ADMIN') throw new AppError("You cannot delete an admin", 403);

  return res.redirect("/users");
});

/**
 * @description - Get the profile of logged in user.
 */
module.exports.getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(res.locals.currentUser)
    .populate('products', '_id , title')
    .populate({
      path: "bids",
      populate: {
        path: "product",
      }
    });

  return res.render("users/profile", {
    user
  })
});

/**
 * @description - Get public profile of a particular user based on its id.
 */
module.exports.getProfileById = catchAsync(async (req, res) => {
  const {
    id
  } = req.params;
  const user = await User.findById(id).populate('products', '_id , title');

  if (!user) throw new AppError('Not Found', 404);
  
  return res.render(`users/view`, {
    user
  });

});

/**
 * @description - Renders edit profile page for current user
 */
module.exports.renderEditProfile = async (req, res) => {
  let user;
  let action;
  const { id } = req.params;
  
  if(id){
    user = await User.findById(id);
    action = `/users/edit/${user._id}?_method=PUT`;
  } else {
    user = req.user;
    action = '/users/profile?_method=PUT';
  }

  if(!user) throw new AppError('Not Found', 404);

  res.render('users/edit', { user, action });
};

/**
 * @description - This function is used to update the profile of the user.
 */
module.exports.updateProfile = catchAsync(async (req, res) => {

  // 1. Getting the current user.
  let user;
  const { id } = req.params;
  id ? user = await User.findById(id) : user = req.user;

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
  if(query.$set.phoneNumber){
      const { phoneNumber } = query.$set;
      // 4.1. Check if the email or phone number is already taken
      const existingUser = await User.findOne({ phoneNumber });

      if (existingUser) {
          req.flash('error', 'Make sure the new phone number is unique.');
          return res.redirect('/users/edit');
      }
  }

  // 5. Finally updating the user.
  await User.findByIdAndUpdate(user._id, query);

  id ? res.redirect(`/users/${id}`) : res.redirect('/users/profile');

})

/**
 * @description - This function is used to submit the bid for a product.
 */
module.exports.submitBid = catchAsync(async (req, res) => {
  // 1. Get the current user.
  const user = req.user;

  // 2. Get the bid amount.
  const {
    amount
  } = req.body;

  // 3. Get the product.
  const product = req.product;

  // 4. If the product has currentHighestBid.amount property then..
  if (product.currentHighestBid.amount) {
    // 4.1. Check if the user has already bid on this product.
    const existingBid = await Bid.findOne({
      user: user._id,
      product: product._id
    })

    // 4.2 If user has already bid on this product then update the bid amount
    if (existingBid) {
      existingBid.amount = amount;
      existingBid.count += 1;
      product.currentHighestBid.amount = amount;
      product.currentHighestBid.user = user._id;
      product.currentHighestBid.bid = existingBid._id;

      await Promise.all([existingBid.save(), product.save()]);

      req.flash("success", "Awesome, your bid has been updated.");
      return res.redirect(`/products/${product._id}`);
    }
  }

  // 5. If user has not bid on this product then create a new bid.
  const bid = new Bid({
    user: user._id,
    product: product._id,
    amount,
    count: 1
  });

  // 6. Update the currentHighestBid property of the product.
  product.currentHighestBid.amount = amount;
  product.currentHighestBid.user = user._id;
  product.currentHighestBid.bid = bid._id;

  // 7. Associate the bid with the product and the user.
  product.bids.push(bid._id);
  user.bids.push(bid._id);

  // 8. Save the bid, product and user.
  await Promise.all([bid.save(), product.save(), user.save()]);

  req.flash("success", "Awesome, your bid has been placed.");
  return res.redirect(`/products/${product._id}`);
});


/**
 * @description - This function is used to render the seller's profile page.
 */
module.exports.renderSellerProfile = catchAsync(async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findById(productId);
  const user = await User.findById(product.user).populate('products', '_id , title');
  return res.render('users/sellerProfile', { product, user });
});

/**
 * @description - This function is used to update the user's address.
 */
module.exports.updateUserAddress = catchAsync(async (req, res) => {
  // Update the users address
  const user = req.user;
  const { billingAddress, shippingAddress } = user.address;

  // Check what fields are changed and update the address
  let query = {
    $set: {}
  }

  // Match the fields
  for (let key in req.body) {
    if (key.startsWith("s_")) {
      if (billingAddress[key.slice(2)] && billingAddress[key.slice(2)] !== req.body[key]) {
        query.$set[`address.billingAddress.${key.slice(2)}`] = req.body[key];
      }
    } else {
      if (shippingAddress[key.slice(2)] && shippingAddress[key.slice(2)] !== req.body[key]) {
        query.$set[`address.shippingAddress.${key.slice(2)}`] = req.body[key];
      }
    }
  }

  // Finally update the user's address.
  await User.findByIdAndUpdate(user._id, query);

  req.flash("success", "Address updated successfully");

  return res.redirect("/users/dashboard");
});

/**
 * @description - This function is used to save the user's address.
 */
module.exports.saveUserAddress = catchAsync(async (req, res) => {
  const user = req.user;

  const billingAddress = {};
  const shippingAddress = {};

  const shippingAddressArray = ["s_name", "s_phoneNumber", "s_address", "s_city", "s_state", "s_pincode"];
  const billingAddressArray = ["b_name", "b_phoneNumber", "b_address", "b_city", "b_state", "b_pincode"];

  shippingAddressArray.forEach(item => billingAddress[item.slice(2)] = req.body[item]);
  billingAddressArray.forEach(item => shippingAddress[item.slice(2)] = req.body[item]);

  user.address.shippingAddress = shippingAddress;
  user.address.billingAddress = billingAddress;

  await user.save();

  req.flash("success", "Address added successfully");

  return res.redirect("/users/dashboard");
});