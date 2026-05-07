const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication');
const compayRFQController = require('./../../controllers/company/company.rfq');

router.route('/api/v1/rfq/rfq-data').get(compayRFQController.getRFQs);
router.route('/api/v1/rfq/new-rfq').post(compayRFQController.createRFQ);
router.route('/api/v1/rfq/rfq-data/:id').get(compayRFQController.getRFQById);
router.route('/api/v1/rfq/:rfqId/quotes').get(compayRFQController.getQuotesByRFQ);
router.route('/api/v1/rfq/quotes/:quoteId/accept').patch(compayRFQController.acceptQuote);
router.route('/api/v1/rfq/quotes/:quoteId/reject').patch(compayRFQController.rejectQuote);

module.exports = router;
