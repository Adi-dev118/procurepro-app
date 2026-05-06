const express = require('express');

const router = express.Router();

router.use('/', require('./admin/admin.dashboard'));

router.use('/', require('./admin/admin.user'));

module.exports = router;
