const express = require('express');
const router = express.Router();
const authController = require('./../../controllers/authentication');
const adminActivitiesController = require('./../../controllers/admin/admin.activities');

router.use(authController.restrictTo('admin'));

router.get(
  '/admin/user/users-data/recent-activities',
  adminActivitiesController.getRecentActivities,
);
router.get('/admin/user/users-data/activities-data', adminActivitiesController.getAllActivities);

module.exports = router;
