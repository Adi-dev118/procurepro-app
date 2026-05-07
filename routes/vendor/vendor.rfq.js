const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication');
const vendorRFQController = require('./../../controllers/vendor/vendor.rfq');

router.use(authController.restrictTo('supplier'));
// router.get('/api/v1/rfq/rfq-data', vendorRFQController.getRFQ);
router.get('/api/v1/rfq/rfq-stats', vendorRFQController.getRFQStats);
router.get('/api/v1/rfq/rfq-data', vendorRFQController.getRFQs);

module.exports = router;