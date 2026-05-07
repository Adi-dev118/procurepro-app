const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication');
const companyProductController = require('./../../controllers/company/company.product');

router.use(authController.restrictTo('customer'));

router.get('/api/v1/product/products-data', companyProductController.getProducts);

module.exports = router;
