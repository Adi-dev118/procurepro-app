const express = require('express');
const router = express.Router();
const authController = require('./../../controllers/authentication');
const adminOrderController = require('./../../controllers/admin/admin.order');
router.get('/order/order-data', adminOrderController.getOrders);
router.get('/order/order-data/order-modal/:orderId', adminOrderController.getOrderProducts);

module.exports = router;
