const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication');
const vendorOrderController = require('./../../controllers/vendor/vendor.order');

router.get('/api/v1/order/orders-data', vendorOrderController.getOrders);
router.get('/api/v1/order/orders-stats', vendorOrderController.getOrderStats);

module.exports = router;