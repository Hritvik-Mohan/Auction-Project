/**
 * Moudule imorts.
 */
const {
    Router
} = require("express");

/**
 * Util imports.
 */
 const { upload } = require("../../utils/multer");

/**
 * Middleware import
 */
const protect = require("../../middlewares/protect");
const role = require("../../middlewares/role")
const isAuthorized = require("../../middlewares/isAuthorized");
const isAuctionOver = require("../../middlewares/isAuctionOver");
const isWinner = require("../../middlewares/isWinner");
const canCheckout = require("../../middlewares/canCheckout");
const isVerified = require("../../middlewares/isVerified");

/**
 * Controller imports.
 */
const {
    getAllProduct,
    getAllListings,
    getOneProduct,
    addNewProduct,
    updateProduct,
    deleteProduct,
    renderEditProduct,
    declareWinner,
    renderCheckout
} = require("../../controllers/product/product.controller");

/**
 * Router object.
 */
const ProductRouter = Router();

/**
 * Get all products route.
 */
ProductRouter.route("/products")
    .get(getAllProduct)

ProductRouter.route("/listings")
    .get(protect, role.checkRole(role.ROLES.Admin), getAllListings)
/**
 * Get product and add product route.
 */
ProductRouter.route('/products/new')
    .get(protect, isVerified, (req, res) => {
        res.render('products/new');
    })
    .post(protect, isVerified, upload.array('images', 6), addNewProduct);

/**
 * Checkout route.
 */
ProductRouter.route("/products/checkout/:id")
    .get(protect, isAuctionOver, isWinner, canCheckout, renderCheckout)

/**
 * Get one product and delete one product route. /products/product_id
 */
ProductRouter.route('/products/:id')
    .get(getOneProduct)
    .put(protect, isAuthorized, upload.array('images'), updateProduct)
    .delete(protect, isAuthorized, deleteProduct)
    .post(declareWinner)
/**
 * Get one and edit product page route. /products/product_id/edit
 */
ProductRouter.route('/products/:id/edit')
    .get(protect, isAuthorized, renderEditProduct)

module.exports = ProductRouter;