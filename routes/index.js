const express = require('express');

const router = express.Router();

router.use('/', require('./admin/admin.dashboard'));

router.use('/', require('./admin/admin.user'));

router.use('/', require('./admin/admin.vendor'));

router.use('/', require('./admin/admin.product'));

router.use('/', require('./admin/admin.order'));

router.use('/', require('./admin/admin.rfq'));

router.use('/', require('./admin/admin.dispute'));

module.exports = router;
