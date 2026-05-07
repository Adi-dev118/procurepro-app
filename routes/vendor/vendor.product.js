const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication');
const vendorProductController = require('../../controllers/vendor/vendor.product');

router.get('/api/v1/product/products-stats', vendorProductController.getProductStats);
router.get('/api/v1/product/products-data', vendorProductController.getProducts);

module.exports = router;
