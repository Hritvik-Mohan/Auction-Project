/**
 * Model imports.
 */
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Bid = require("../../models/bid.model");

/**
 * Utils imports.
 */
const catchAsync = require("../../utils/catchAsync");
const {
    cloudinary
} = require("../../utils/cloudinaryUpload");
const AppError = require("../../utils/AppError");

/**
 * Get all products from the database
 */
module.exports.getAllProduct = catchAsync(async (req, res) => {
    const products = await Product.find({});
    res.render("products/index", {
        products,
    });
});

/**
 * Get only one product based on product id.
 */
module.exports.getOneProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate("user", "_id, firstName")
        .populate({
            path: "currentHighestBid",
            populate: {
                path: "user",
                select: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                },
            },
        });
  

    if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/products");
    }
    res.render("products/product", {
        product,
    });
});

/**
 * Adds a new product to the database.
 */
module.exports.addNewProduct = catchAsync(async (req, res) => {
    const user = req.user;

    const {
        title,
        description,
        basePrice,
        category,
        startTime,
        duration
    } =
    req.body;

    // console.log(req.body);

    // 1. Creating the new product.
    const product = new Product(req.body);

    // 2. Saving the images data to the images property of the product
    product.images = req.files.map((file) => ({
        path: file.path,
        filename: file.filename,
    }));

    // 3. Associate the product with the user.
    product.user = req.user._id;

    // 4. Associating the user with the product.
    user.products.push(product._id);

    // 5. Setting the auction status based on time.
    const today = new Date();
    const endTime = new Date(product.endTime);

    if(product.startTime <= today && endTime >= today){
        product.auctionStatus = true;
    } else {
        product.auctionStatus = false;
    };

    // 6. Saving the product to the database and the updated user.
    await Promise.all([product.save(), user.save()]);

    req.flash("success", "Product added successfully.");

    res.redirect(`/products/${product._id}`);
});

/**
 * Render the product edit page.
 */
module.exports.renderEditProduct = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const product = await Product.findById(id);
    res.render("products/edit", {
        product
    });
});

/**
 * Updates the product based on its id.
 */
module.exports.updateProduct = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const product = await Product.findById(id);

    // Check what fields are changed and need to be updated.
    let query = {
        $set: {}
    };
    for (let key in req.body) {
        if (product[key] && product[key] !== req.body[key]) {
            query.$set[key] = req.body[key];
        }
    }
    
    // Check if start time or duration were changed
    if (query.$set.startTime || query.$set.duration) {
        const today = new Date();
        let startTimeInSeconds;

        if(query.$set.startTime) startTimeInSeconds = new Date(query.$set.startTime).getTime() / 1000;
        else startTimeInSeconds = product.startTime.getTime() / 1000;
        
        const endTimeInSeconds = startTimeInSeconds + Number(query.$set.duration) * 24 * 60 * 60;
        const endTime = new Date(endTimeInSeconds * 1000);

        if(new Date(query.$set.startTime) <= today && endTime >= today){
            query.$set.auctionStatus = true;
        } else {
            query.$set.auctionStatus = false;
        }
    }

    // Check if there are any images to be deleted
    if (req.body.deleteImages?.length) {
        const {
            deleteImages
        } = req.body;
        
        // If the number of images being deleted is equal
        // to total number of available images then prevent
        // from deleting all images.
        if(deleteImages.length === product.images.length){
            req.flash("error", "Cannot delete all images");
            return res.redirect(`/products/${product._id}/edit`);
        }

        // Delete the images from the cloudinary.
        await Promise.all(
            deleteImages.map((filename) => cloudinary.uploader.destroy(filename))
        );
        // Delete the images from the product.
        product.images = product.images.filter(image => {
            if(!deleteImages.includes(image.filename)) return image;
        });
    }

    // Check if there are any images to be added
    if (req.files.length > 0) {
        product.images = [...product.images, ...req.files.map((file) => ({
            path: file.path,
            filename: file.filename,
        }))];
    }

    // Running the update query parallely togeather.
    await Promise.all([
        Product.findByIdAndUpdate(id, query["$set"]),
        product.save()
    ]);

    return res.redirect(`/products/${id}`);
});

/**
 * Deletes the product based on its id.
 */
module.exports.deleteProduct = catchAsync(async (req, res) => {
    //1. Get product id from the params.
    const {
        id
    } = req.params;

    //2. Find the product by its id.
    const product = await Product.findById(id);
    //3. Check if the product exists.
    if (!product) throw new AppError("Product not found", 404);

    //4. Delete the product from the database
    await Product.findByIdAndDelete(id);

    //5. Delete the images from the cloudinary if it exists on cloudinary.
    try {
        await Promise.all(
            product.images.map((image) => cloudinary.uploader.destroy(image.filename))
        );
    } catch (e) {
        req.flash("success", "Product deleted successfully.");
        return res.redirect("/products");
    }

    //6. Flash success message.
    req.flash("success", "Product deleted successfully.");

    //7. Redirect to products page.
    return res.redirect("/products");
});

/**
 * Claim the winning bid.
 */
module.exports.claimProduct = catchAsync(async (req, res) => {
    const currentUser = req.user;
    const product = req.product;

    if(!currentUser.bidsWon.includes(product.currentHighestBid.bid)){
        currentUser.bidsWon.push(product.currentHighestBid.bid);
        product.auctionStatus = false;
        await Promise.all([product.save(), currentUser.save()]);
        req.flash("success", "You have claimed the bid.");
        return res.redirect(`/products/${product._id}`);
    } else {
        req.flash('error', 'You have already won this product.');
        return res.redirect(`/products/${product._id}`);
    }

});

/**
 * @description - This function is used to declare the winner and save it to db.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * 
 */
module.exports.declareWinner = catchAsync(async (req, res) => {
   
    const { id: productId } = req.params;
    const { amount, userId, bidId } = req.body;

    if(!amount || !userId || !bidId){
        return res.send({
            msg: "Invalid request"
        })
    }

    const product = await Product.findById(productId);

    if(!product) throw new AppError("Product not found", 404);

    if(product.auctionStatus === false){
        return res.send({
            status: false,
            msg: "Auction is not running"
        })
    }

    const [user, bid] = await Promise.all([
        User.findById(userId),
        Bid.findById(bidId),
    ]);

    if(!user || !bid) throw new AppError("Invalid informations", 404);

    product.auctionStatus = false;
    user.bidsWon.push(bidId);

    await Promise.all([
        product.save(),
        user.save()
    ]);

    return res.send({
        status: true,
        msg: "Winner is declared successfully."
    });

});

/**
 * @description - This function renders the checkout page.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
module.exports.renderCheckout = (req, res) => {
    const product = req.product;
    const user = req.user;
    const { billingAddress = false, shippingAddress = false } = user.address;

    res.render("products/checkout", {
        product,
        user,
        billingAddress,
        shippingAddress
    })
};