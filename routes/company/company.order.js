const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication');
const companyOrderController = require('./../../controllers/company/company.order');

router.get('/api/v1/order/order-stats', companyOrderController.getOrderStats);
router.get('/api/v1/order/order-data', companyOrderController.getOrders);

module.exports = router;
