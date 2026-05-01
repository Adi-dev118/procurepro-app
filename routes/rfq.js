const express = require('express');
const rfqController = require('./../controllers/rfq');

const router = express.Router();

router.route('/new').post(rfqController.createRFQ);
router.route('/:rfqId/quotes').get(rfqController.getQuotesByRFQ);
router.route('/rfq-data/:id').get(rfqController.getRFQById);
router.route('/rfq-data/:id').get(rfqController.getRFQById);

router.route('/quotes/:quoteId/accept').patch(rfqController.acceptQuote);
router.route('/quotes/:quoteId/reject').patch(rfqController.rejectQuote);

module.exports = router;
