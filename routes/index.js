const express = require('express');

const router = express.Router();

router.use('/', require('./admin/admin.dashboard'));

router.use('/', require('./admin/admin.user'));

router.use('/', require('./admin/admin.vendor'));

router.use('/', require('./admin/admin.product'));

router.use('/', require('./admin/admin.order'));

module.exports = router;
