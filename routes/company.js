const express = require('express');
const router = express.Router();

const authController = require('./../controllers/authentication');

router.get('/company/login', (req, res) => {
  res.render('company/login');
});
router.get('/signup', (req, res) => {
  res.render('company/login');
});

router.get(
  '/dashboard',
  authController.protect,
  authController.restrictTo('customer'),
  (req, res) => {
    res.render('company/dashboard');
  },
);

router.get(
  '/rfq/:id/quotes',
  authController.protect,
  authController.restrictTo('customer'),
  (req, res) => {
    res.render('company/rfq-quotes');
  },
);

router.get(
  '/rfq/:id',
  authController.protect,
  authController.restrictTo('customer'),
  (req, res) => {
    res.render('company/rfq-success');
  },
);

router.get('/create', authController.protect, authController.restrictTo('customer'), (req, res) => {
  res.render('company/create-rfq');
});

router.get('/cart', authController.protect, authController.restrictTo('customer'), (req, res) => {
  res.render('company/cart');
});

router.get(
  '/profile',
  authController.protect,
  authController.restrictTo('customer'),
  (req, res) => {
    res.render('company/profile');
  },
);

router.get('/orders', authController.protect, authController.restrictTo('customer'), (req, res) => {
  res.render('company/orders');
});

router.get('/rfq', authController.protect, authController.restrictTo('customer'), (req, res) => {
  res.render('company/rfq');
});

router.get(
  '/marketplace',
  authController.protect,
  authController.restrictTo('customer'),
  (req, res) => {
    res.render('company/marketplace');
  },
);

module.exports = router;
