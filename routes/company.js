const express = require('express');
const router = express.Router();
const userController = require('./../controllers/users');
const productController = require('./../controllers/product');
const orderController = require('./../controllers/order');

const authController = require('./../controllers/authentication');

router.get('/dashboard', (req, res) => {
  res.render('company/dashboard');
});

router.get('/marketplace', (req, res) => {
  res.render('company/marketplace');
});

router.get('/rfq', (req, res) => {
  res.render('company/rfq');
});

router.get('/orders', (req, res) => {
  res.render('company/orders');
});

router.get('/profile', (req, res) => {
  res.render('company/profile');
});

router.get('/company/login', (req, res) => {
  res.render('company/login');
});

router.get('/cart', (req, res) => {
  res.render('company/cart');
});

router.get('/rfq/create', (req, res) => {
  res.render('company/create-rfq');
});

router.get('/rfq/:id', (req, res) => {
  res.render('company/rfq-success');
});

router.get('/rfq/:id/quotes', (req, res) => {
  res.render('company/rfq-quotes');
});

module.exports = router;
