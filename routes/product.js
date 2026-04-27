const express = require('express');
const productController = require('./../controllers/product');

const router = express.Router();

router.route('/').post(productController.newProduct).get(productController.getAllProducts);

router.route('/:id').patch(productController.updateProduct);
router.route('/categories').get(productController.getCategories);
router.route('/by-category/:categoryId').get(productController.getProductByCategory);





module.exports = router