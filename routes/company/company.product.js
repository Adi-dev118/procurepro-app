const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication');
const companyProductController = require('./../../controllers/company/company.product');

router.get('/api/v1/product/products-data', companyProductController.getProducts);

router.route('/').post(companyProductController.newProduct).get(companyProductController.getAllProducts);
router.route('/categories').get(companyProductController.getCategories);
router.route('/by-category/:categoryId').get(companyProductController.getProductByCategory);
router.route('/:id').patch(companyProductController.updateProduct);


module.exports = router;
