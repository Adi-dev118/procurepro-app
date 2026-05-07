const express = require('express');
const router = express.Router();
const authController = require('./../../controllers/authentication');
const adminActivitiesController = require('./../../controllers/admin/admin.activities');

router.get(
  '/user/users-data/recent-activities',
  adminActivitiesController.getRecentActivities,
);
router.get('/user/users-data/activities-data', adminActivitiesController.getAllActivities);

module.exports = router;
