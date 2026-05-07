const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication');
const vendorRFQController = require('./../../controllers/vendor/vendor.rfq');

router.get('/api/v1/rfq/rfq-stats', vendorRFQController.getRFQStats);
router.get('/api/v1/rfq/rfq-data', vendorRFQController.getRFQs);
router.get('/api/v1/rfq/quotes/:id', vendorRFQController.getQuoteById);
router.post('/api/v1/rfq/quotes/:rfqId/submit', vendorRFQController.submitQuote);

module.exports = router;
