const express = require('express');
const router = express.Router();
const authController = require('./../../controllers/authentication');
const adminDashboardController = require('./../../controllers/admin/admin.dashboard');


router.use(authController.restrictTo('admin'));
router.get('/api/v1/admin/dashboard-stats', adminDashboardController.adminStats);

module.exports = router;
