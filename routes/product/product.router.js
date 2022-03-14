const {
    Router
} = require("express");
const { getAllProducts } = require("../../controllers/product/product.controller");
const Product = require("../../models/Product");

const ProductRouter = Router();


ProductRouter.route('/products')
    .get(getAllProducts)
    .post(async (req, res) => {
        console.log(req.body);
        const product = new Product(req.body.product)
        const savedProduct = await product.save();
        res.send(savedProduct)
    })

ProductRouter.route('/products/new')
    .get((req, res) => {
        res.render('products/new');
    })

ProductRouter.route('/products/:id')
    .get(async (req, res) => {
        const product = await Product.findById(req.params.id).populate('user');
        res.send(product);
        res.render('products/product', {
            product
        });
    })

ProductRouter.route('/products/:id/edit')
    .get(async (req, res) => {
        // ! Will come back to this later
        const product = await Product.findById(req.params.id).populate('user');
        res.send(product)
    })

module.exports = ProductRouter;