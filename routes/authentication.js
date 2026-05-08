const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authentication');

router.route('/signup').post(authController.signup);
router.route('/api/v1/users/login').post(authController.login);
router.route('/logout').post(authController.logout);

module.exports = router;
