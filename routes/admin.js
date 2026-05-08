const express = require('express');

const authController = require('./../controllers/authentication');

const router = express.Router();

/* =========================================
   ADMIN AUTH MIDDLEWARE
========================================= */

router.use(authController.protect, authController.restrictTo('admin'));

/* =========================================
   ADMIN DASHBOARD
========================================= */

router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard');
});

/* =========================================
   USERS
========================================= */

router.get('/users', (req, res) => {
  res.render('admin/users');
});

/* =========================================
   SUPPLIERS
========================================= */

router.get('/suppliers', (req, res) => {
  res.render('admin/suppliers');
});

router.get('/supplier-details/:supplierId', (req, res) => {
  res.render('admin/supplier-detail');
});

/* =========================================
   PRODUCTS
========================================= */

router.get('/products', (req, res) => {
  res.render('admin/products');
});

/* =========================================
   ORDERS
========================================= */

router.get('/orders', (req, res) => {
  res.render('admin/orders');
});

router.get('/order-detail/:orderId', (req, res) => {
  res.render('admin/order-detail');
});

/* =========================================
   RFQS
========================================= */

router.get('/rfqs', (req, res) => {
  res.render('admin/rfqs');
});

/* =========================================
   DISPUTES
========================================= */

router.get('/disputes', (req, res) => {
  res.render('admin/disputes');
});

/* =========================================
   ACTIVITIES
========================================= */

router.get('/activities', (req, res) => {
  res.render('admin/activities');
});

/* =========================================
   SETTINGS
========================================= */

router.get('/setting', (req, res) => {
  res.render('admin/settings');
});

module.exports = router;
