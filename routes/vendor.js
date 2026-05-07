const express = require('express');
const router = express.Router();
const vendorController = require('./../controllers/vendor');
const productController = require('./../controllers/product');
const orderController = require('./../controllers/order');
const authController = require('./../controllers/authentication');


router.get('/vendor/dashboard', vendorController.vendorDashboard);

router.get('/vendor/products', (req, res) => {
  res.render('vendor/products');
});

router.get('/vendor/rfqs', (req, res) => {
  res.render('vendor/rfqs');
});

router.get('/vendor/orders', (req, res) => {
  res.render('vendor/orders');
});

router.get('/vendor/profile', vendorController.profileDashboard);

router.get('/vendor/finance', vendorController.financeDashboard);

router.get('/vendor/rfq/:id', (req, res) => {
  res.render('vendor/rfq-details');
});

module.exports = router;
