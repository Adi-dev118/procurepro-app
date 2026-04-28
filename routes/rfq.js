const express = require('express');
const rfqController = require('./../controllers/rfq');

const router = express.Router();

router.route('/new').post(rfqController.createRFQ);


module.exports = router