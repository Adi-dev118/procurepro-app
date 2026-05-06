const express = require('express');
const userControllers = require('./../controllers/users');
const authController = require('./../controllers/authentication');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').post(authController.logout);


module.exports = router;
