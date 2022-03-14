const catchAsync = require("../../utils/catchAsync");
const Product = require("../../models/product.model")

module.exports.addNewProduct = catchAsync(async(req, res)=>{
    // ! Later
    res.send({ "msg": "working on it" })
})

module.exports.editProduct = catchAsync(async (req, res)=>{
    // ! Later
    res.send({ "msg": "working on it" })
})

module.exports.deleteProduct = catchAsync(async (req, res)=>{
    // !Later
    res.send({ "msg": "working on it" })
})