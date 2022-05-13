/**
 * Moudule imorts.
 */
const {
    Router
} = require("express");
const multer = require('multer')

/**
 * Util imports.
 */
const {
    storage
} = require("../../utils/cloudinaryUpload");
const upload = multer({
    storage
})

/**
 * Middleware import
 */
const protect = require("../../middlewares/protect");
const isAuthorized = require("../../middlewares/isAuthorized");
const isAuctionOver = require("../../middlewares/isAuctionOver");
const isWinner = require("../../middlewares/isWinner");

/**
 * Controller imports.
 */
const {
    getAllProduct,
    getOneProduct,
    addNewProduct,
    updateProduct,
    deleteProduct,
    renderEditProduct,
    claimProduct,
    declareWinner
} = require("../../controllers/product/product.controller");

/**
 * Router object.
 */
const ProductRouter = Router();

/**
 * Get all products route.
 */
ProductRouter.route('/products')
    .get(getAllProduct)

/**
 * Get product and add product route.
 */
ProductRouter.route('/products/new')
    .get(protect,(req, res) => {
        res.render('products/new');
    })
    .post(protect, upload.array('images', 6), addNewProduct)

/**
 * Get one product and delete one product route.
 */
ProductRouter.route('/products/:id')
    .get(getOneProduct)
    .put(protect, isAuthorized, upload.array('images'), updateProduct)
    .delete(protect, isAuthorized, deleteProduct)
    .post(declareWinner)
/**
 * Get one and edit product page route.
 */
ProductRouter.route('/products/:id/edit')
    .get(protect, isAuthorized, renderEditProduct)

module.exports = ProductRouter;