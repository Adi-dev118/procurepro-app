const express = require('express');
const router = express.Router();
const authController = require('./../../controllers/authentication');
const adminOrderController = require('./../../controllers/admin/admin.order');

router.use(authController.restrictTo('admin'));
router.get('/admin/order/order-data', adminOrderController.getOrders);
router.get('/admin/order/order-data/order-modal/:orderId', adminOrderController.getOrderProducts);

module.exports = router;
