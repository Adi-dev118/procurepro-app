const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('./../controllers/authentication');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Try again in 15 minutes.',
});

router.route('/signup').post(authController.signup);
router.route('/api/v1/users/login').post(loginLimiter, authController.login);
router.route('/logout').post(authController.logout);

module.exports = router;
