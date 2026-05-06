const express = require('express');

const router = express.Router();

router.use(
  '/',
  require('./admin/admin.dashboard')
);

module.exports = router;