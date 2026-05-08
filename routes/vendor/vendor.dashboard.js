const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication');
const vendorDashboardController = require('./../../controllers/vendor/vendor.dashboard');

router.get('/api/v1/profile-data', vendorDashboardController.getProfile);
router.get('/api/v1/dashboard/stats', vendorDashboardController.vendorStats);
router.get('/api/v1/dashboard/recent-order', vendorDashboardController.getRecentOrders);
router.get('/api/v1/dashboard/rating', vendorDashboardController.getRatingAndStatus);

module.exports = router;
