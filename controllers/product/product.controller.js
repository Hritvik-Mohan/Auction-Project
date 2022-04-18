/**
 * Model imports.
 */
const Product = require("../../models/product.model");

/**
 * Utils imports.
 */
const catchAsync = require("../../utils/catchAsync")
const { cloudinary } = require("../../utils/cloudinaryUpload");

/**
 * Get all products from the database
 */
module.exports.getAllProduct = catchAsync(async (req, res) => {
    const products = await Product.find({})
    res.render('products/index', {
        products
    });
})

/**
 * Get only one product based on product id.
 */
module.exports.getOneProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('user');
    if(!product) {
        req.flash('error', 'Product not found');
        return res.redirect('/products');
    }
    res.render('products/product', {
        product
    });
})

/**
 * Adds a new product to the database.
 */
module.exports.addNewProduct = catchAsync(async(req, res)=>{

    const user = req.user;

    const {
        title,
        description,
        basePrice,
        category,
        startTime,
        duration
    } = req.body;

    // console.log(req.body);

    // 1. Creating the new product.
    const product = new Product(req.body);

    // 2. Saving the images data to the images property of the product
    product.images = req.files.map(file => ({ path: file.path, filename: file.filename }));

    // 3. Associate the product with the user.
    product.user = req.user._id;

    // 4. Associating the user with the product.
    user.products.push(product._id);

    // 5. Saving the product to the database and the updated user.
    await product.save();
    await user.save();

    req.flash('success', 'Product added successfully.');

    res.redirect(`/products/${product._id}`);
})

module.exports.renderEditProduct = catchAsync(async (req, res)=>{
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product });
});

module.exports.updateProduct = catchAsync(async (req, res)=>{
    const { id } = req.params;
    const product = await Product.findById(id);

    // Check what fields are changed and need to be updated.
    let query = { $set: {} };
    for (let key in req.body){
      if(product[key] && product[key] !== req.body[key]){
        query.$set[key] = req.body[key];
      }
    }

    // Check if there are any images to be deleted
    if(req.body.deleteImages?.length){
        const { deleteImages } = req.body;
        await Promise.all(deleteImages.map(filename => (cloudinary.uploader.destroy(filename))));
        // Delete the images from the product
        query.$pull = { images: { $in: req.body.deleteImages } };
    }

    // Check if there are any images to be added
    if(req.files){
        // Add the new images to the product
        query.$push = { images: req.files.map(file => ({ path: file.path, filename: file.filename })) };
    }
    
    // Running the update query parallely togeather.
    await Promise.all(
        [
            Product.findByIdAndUpdate(id, query['$set']), 
            Product.findByIdAndUpdate(id, query['$pull']),
            Product.findByIdAndUpdate(id, query['$push'])
        ]
    );

    return res.redirect(`/products/${id}`);
})

module.exports.deleteProduct = catchAsync(async (req, res)=>{
    // !Later
    res.send({ "msg": "working on it" })
});