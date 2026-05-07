const express = require('express');
const router = express.Router();
const authController = require('./../../controllers/authentication');
const adminDisputeController = require('./../../controllers/admin/admin.dispute');

router.get('/dispute/dispute-data', adminDisputeController.getDisputes);

module.exports = router;
