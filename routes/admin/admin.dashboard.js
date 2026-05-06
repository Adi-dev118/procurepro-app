const express = require('express');
const router = express.Router();
const authController = require('./../../controllers/authentication');
const adminDashboardController = require('./../../controllers/admin/admin.dashboard');

router.use(authController.restrictTo('admin'));

router.get('/api/v1/admin/dashboard-stats', adminDashboardController.adminStats);
router.get('/api/v1/admin/users-stats', adminDashboardController.userStats);
router.get('/api/v1/admin/vendor-stats', adminDashboardController.vendorStats);
router.get('/api/v1/admin/product-stats', adminDashboardController.productStats);
router.get('/api/v1/admin/order-stats', adminDashboardController.orderStats);
router.get('/api/v1/admin/dispute-stats', adminDashboardController.disputeStats);

module.exports = router;
