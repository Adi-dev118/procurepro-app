const express = require('express');

const authController = require('./../controllers/authentication');
const vendorController = require('./../controllers/vendor');

const router = express.Router();

/* =========================================
   VENDOR AUTH MIDDLEWARE
========================================= */

router.use(
  authController.protect,
  authController.restrictTo('supplier'),
);

/* =========================================
   VENDOR DASHBOARD
========================================= */

router.get('/dashboard', (req, res) => {
  res.render('vendor/dashboard');
});

/* =========================================
   PRODUCTS
========================================= */

router.get('/products', (req, res) => {
  res.render('vendor/products');
});

/* =========================================
   RFQS
========================================= */

router.get('/rfqs', (req, res) => {
  res.render('vendor/rfqs');
});

router.get('/rfq/:id', (req, res) => {
  res.render('vendor/rfq-details');
});

/* =========================================
   ORDERS
========================================= */

router.get('/orders', (req, res) => {
  res.render('vendor/orders');
});

/* =========================================
   PROFILE
========================================= */

router.get('/profile', vendorController.profileDashboard);

/* =========================================
   FINANCE
========================================= */

router.get('/finance', vendorController.financeDashboard);

module.exports = router;