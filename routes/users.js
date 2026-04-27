const express = require('express');
const userControllers = require('./../controllers/users');
const authController = require('./../controllers/authentication')

const router = express.Router();

router.route('/').get(authController.restrictTo('admin'), userControllers.getAllUsers);
router.route('/:id').delete(userControllers.deleteUser);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').post(authController.logout);
router.route('/vendor/by-category/:categoryId').get(userControllers.getVendorByCategory);

module.exports = router