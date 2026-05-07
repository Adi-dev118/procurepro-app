const express = require('express');
const router = express.Router();
const companyController = require('./../controllers/company');
const userController = require('./../controllers/users');
const productController = require('./../controllers/product');
const rfqController = require('./../controllers/rfq');
const orderController = require('./../controllers/order');

router.get('/dashboard', (req, res) => {
  res.render('company/dashboard');
});

router.get('/marketplace', (req, res) => {
  res.render('company/marketplace');
});

router.get('/company/rfq/rfq-data', rfqController.getCompanyRFQs);

router.get('/rfq', companyController.rfqsDashboard);

router.get('/orders', (req, res) => {
  res.render('company/orders')
});

router.get('/profile', companyController.profileDashboard);

router.get('/signup', (req, res) => {
  res.render('company/login');
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
