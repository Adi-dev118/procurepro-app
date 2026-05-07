const express = require('express');
const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('company/login');
});

module.exports = router;
