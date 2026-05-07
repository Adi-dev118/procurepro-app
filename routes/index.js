const express = require('express');

const router = express.Router();

router.use('/admin', require('./admin/admin.dashboard'));

router.use('/admin', require('./admin/admin.user'));

router.use('/admin', require('./admin/admin.vendor'));

router.use('/admin', require('./admin/admin.product'));

router.use('/admin', require('./admin/admin.order'));

router.use('/admin', require('./admin/admin.rfq'));

router.use('/admin', require('./admin/admin.dispute'));

router.use('/admin', require('./admin/admin.activities'));

router.use('/vendor', require('./vendor/vendor.dashboard'));

router.use('/vendor', require('./vendor/vendor.product'));

router.use('/vendor', require('./vendor/vendor.order'));

module.exports = router;
