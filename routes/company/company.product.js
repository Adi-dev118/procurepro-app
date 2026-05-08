const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication');
const companyProductController = require('./../../controllers/company/company.product');

router.get('/api/v1/product/products-data', companyProductController.getProducts);

router.route('/').post(productController.newProduct).get(productController.getAllProducts);
router.route('/categories').get(productController.getCategories);
router.route('/by-category/:categoryId').get(productController.getProductByCategory);
router.route('/:id').patch(productController.updateProduct);


module.exports = router;
