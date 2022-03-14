const User = require("../../models/user.model");
const catchAsync = require("../../utils/catchAsync")

module.exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find({});
    res.render('users/index', {
        users
    })
});