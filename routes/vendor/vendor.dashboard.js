const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication');
const vendorDashboardController = require('./../../controllers/vendor/vendor.dashboard');

router.use(authController.restrictTo('supplier'));

router.get('/api/v1/profile-data', vendorDashboardController.getProfile);
router.get('/api/v1/dashboard/stats', vendorDashboardController.vendorStats);
router.get('/api/v1/dashboard/recent-order', vendorDashboardController.getRecentOrders);

module.exports = router;
