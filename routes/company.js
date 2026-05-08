const express = require('express');

const authController = require('./../controllers/authentication');

const router = express.Router();

/* =========================================
   PUBLIC ROUTES
========================================= */

router.get('/login', (req, res) => {
  res.render('company/login');
});

router.get('/signup', (req, res) => {
  res.render('company/login');
});

/* =========================================
   COMPANY AUTH MIDDLEWARE
========================================= */

router.use(
  authController.protect,
  authController.restrictTo('customer'),
);

/* =========================================
   DASHBOARD
========================================= */

router.get('/dashboard', (req, res) => {
  res.render('company/dashboard');
});

/* =========================================
   RFQ
========================================= */

router.get('/rfq/:id/quotes', (req, res) => {
  res.render('company/rfq-quotes');
});

router.get('/rfq/:id', (req, res) => {
  res.render('company/rfq-success');
});

router.get('/rfq', (req, res) => {
  res.render('company/rfq');
});

/* =========================================
   CREATE RFQ
========================================= */

router.get('/create', (req, res) => {
  res.render('company/create-rfq');
});

/* =========================================
   CART
========================================= */

router.get('/cart', (req, res) => {
  res.render('company/cart');
});

/* =========================================
   PROFILE
========================================= */

router.get('/profile', (req, res) => {
  res.render('company/profile');
});

/* =========================================
   ORDERS
========================================= */

router.get('/orders', (req, res) => {
  res.render('company/orders');
});

/* =========================================
   MARKETPLACE
========================================= */

router.get('/marketplace', (req, res) => {
  res.render('company/marketplace');
});

module.exports = router;