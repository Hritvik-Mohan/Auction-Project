const User = require("../../models/user.model");
const catchAsync = require("../../utils/catchAsync")

module.exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find({});
    res.status(200).send(users)
});


module.exports.getProfile = catchAsync(async (req, res)=>{
    const user = req.user;
    return res.render("users/profile", { user })
})