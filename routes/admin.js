const express = require('express');

const authController = require('./../controllers/authentication');

const router = express.Router();

/* =========================================
   ADMIN DASHBOARD
========================================= */

router.get(
  '/admin/dashboard',
  authController.protect,
  authController.restrictTo('admin'),
  (req, res) => {
    res.render('admin/dashboard');
  },
);

/* =========================================
   USERS
========================================= */

router.get(
  '/admin/users',
  authController.protect,
  authController.restrictTo('admin'),
  (req, res) => {
    res.render('admin/users');
  },
);

/* =========================================
   SUPPLIERS
========================================= */

router.get(
  '/admin/suppliers',
  authController.protect,
  authController.restrictTo('admin'),
  (req, res) => {
    res.render('admin/suppliers');
  },
);

router.get(
  '/admin/supplier-details/:supplierId',
  authController.protect,
  authController.restrictTo('admin'),
  (req, res) => {
    res.render('admin/supplier-detail');
  },
);

/* =========================================
   PRODUCTS
========================================= */

router.get(
  '/admin/products',
  authController.protect,
  authController.restrictTo('admin'),
  (req, res) => {
    res.render('admin/products');
  },
);

/* =========================================
   ORDERS
========================================= */

router.get(
  '/admin/orders',
  authController.protect,
  authController.restrictTo('admin'),
  (req, res) => {
    res.render('admin/orders');
  },
);

router.get(
  '/admin/order-detail/:orderId',
  authController.protect,
  authController.restrictTo('admin'),
  (req, res) => {
    res.render('admin/order-detail');
  },
);

/* =========================================
   RFQS
========================================= */

router.get(
  '/admin/rfqs',
  authController.protect,
  authController.restrictTo('admin'),
  (req, res) => {
    res.render('admin/rfqs');
  },
);

/* =========================================
   DISPUTES
========================================= */

router.get(
  '/admin/disputes',
  authController.protect,
  authController.restrictTo('admin'),
  (req, res) => {
    res.render('admin/disputes');
  },
);

/* =========================================
   ACTIVITIES
========================================= */

router.get(
  '/admin/activities',
  authController.protect,
  authController.restrictTo('admin'),
  (req, res) => {
    res.render('admin/activities');
  },
);

/* =========================================
   SETTINGS
========================================= */

router.get(
  '/admin/setting',
  authController.protect,
  authController.restrictTo('admin'),
  (req, res) => {
    res.render('admin/settings');
  },
);

module.exports = router;
