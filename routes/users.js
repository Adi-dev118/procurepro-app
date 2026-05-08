const express = require('express');
const authController = require('./../controllers/authentication');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/api/v1/users/login').post(authController.login);
router.route('/logout').post(authController.logout);


module.exports = router;
