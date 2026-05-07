const express = require('express');
const router = express.Router();
const authController = require('./../../controllers/authentication');
const adminproductController = require('./../../controllers/admin/admin.product');

router.get('/product/product-data', adminproductController.getProducts);

module.exports = router;
