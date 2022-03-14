const catchAsync = require("../../models/product.model");
const Product = require("../../models/product.model")

module.exports.registerProduct = catchAsync((req, res) => {
    const {
        title,
        description,
        basePrice,
        images,
        startTime,
        category,
        duration
    } = req.body.product;
    if (!title || !description || !basePrice || !images || !startTime || !category || !duration) {
        return res.status(400).send({
            success: false,
            error: "title, description, basePrice, images and startTime are required"
        });
    }

    const product = new Product(req.body.product);
    await product.save();

    res.status(200).send({
        success: true,
        product: {
            title: product.title,
            description: product.description,
            basePrice: product.basePrice,
            images: product.images,
            startTime: product.startTime,
            category: product.category,
            duration: product.duration
        }
    });
});