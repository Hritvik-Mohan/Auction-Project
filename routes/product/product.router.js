const {
    Router
} = require("express");
const {
    getAllProducts,
    getOneProduct
} = require("../../controllers/product/product.controller");
const {
    addNewProduct,
    editProduct,
    deleteProduct
} = require("../../controllers/product/auth.controller")

const ProductRouter = Router();


ProductRouter.route('/products')
    .get(getAllProducts)
    .post(addNewProduct)

ProductRouter.route('/products/new')
    .get((req, res) => {
        res.render('products/new');
    })

ProductRouter.route('/products/:id')
    .get(getOneProduct)
    .delete(deleteProduct);

ProductRouter.route('/products/:id/edit')
    .get(editProduct)


module.exports = ProductRouter;