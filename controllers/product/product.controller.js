const Product = require("../../models/product.model");
const catchAsync = require("../../utils/catchAsync")

module.exports.getAllProducts = catchAsync(async (req, res) => {
    const products = await Product.find({})
    res.render('products/index', {
        products
    });
})

module.exports.getOneProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('user');
    res.render('products/product', {
        product
    });
})