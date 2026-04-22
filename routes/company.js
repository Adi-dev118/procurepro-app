const express = require('express');
const router = express.Router();
const companyController = require('./../controllers/company');
const userController = require('./../controllers/users');
const productController = require('./../controllers/product');
const rfqController = require('./../controllers/rfq');
const orderController = require('./../controllers/order');
const { render } = require('../app');

router.get('/dashboard', companyController.companyDashboard);

router.get('/marketplace', companyController.marketplaceDashboard);

router.get('/company/dashboard/dashboard-data', userController.getRecentOrdersRFQS);
router.get('/company/product/products-data', productController.getCompanyProducts);
router.get('/company/order/order-data', orderController.getCompanyOrders);
router.get('/company/rfq/rfq-data', rfqController.getCompanyRFQs);

router.get('/rfq', companyController.rfqsDashboard);

router.get('/orders', companyController.ordersDashboard);

router.get('/profile', companyController.profileDashboard);

router.get('/signup', (req, res) => {
  res.render('company/login');
});

router.get('/company/login', (req, res) => {
  res.render('company/login');
});

module.exports = router;
