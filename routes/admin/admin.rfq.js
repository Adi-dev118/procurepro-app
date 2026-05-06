const express = require('express');
const router = express.Router();
const authController = require('./../../controllers/authentication');
const adminRfqController = require('./../../controllers/admin/admin.rfq');

router.use(authController.restrictTo('admin'));

router.get('/api/v1/admin/all-rfq-data', adminRfqController.getAllRfqs);
router.get('/api/v1/admin/rfq/:id/items', adminRfqController.getRfqItems);
router.get('/api/v1/admin/rfq/:id/quotes', adminRfqController.getRfqQuotes);
router.get('/api/v1/admin/rfq/:id/specifications', adminRfqController.getRfqSpecifications);

module.exports = router;
