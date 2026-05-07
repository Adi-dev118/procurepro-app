const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication');
const compayDashboardController = require('./../../controllers/company/company.dashboard');

router.use(authController.restrictTo('customer'));

router.get('/api/v1/dashboard/cuurent-user', compayDashboardController.getCurrentUser);
router.get('/api/v1/dashboard/stats', compayDashboardController.companyStats);
router.get('/api/v1/dashboard/recent-data', compayDashboardController.getRecentOrdersRFQS);

module.exports = router;
