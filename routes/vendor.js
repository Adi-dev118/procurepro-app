const express = require('express');
const router = express.Router();
const vendorController = require('./../controllers/vendor');
const productController = require('./../controllers/product');
const orderController = require('./../controllers/order');
const rfqController = require('./../controllers/rfq');
const { render } = require('../app');

router.get('/vendor/dashboard', vendorController.vendorDashboard);

router.get('/vendor/products', vendorController.productsDashboard);

router.get('/vendor/rfqs', vendorController.rfqDashboard);

router.get('/vendor/orders', vendorController.orderDashboard);

router.get('/vendor/profile', vendorController.profileDashboard);

router.get('/vendor/finance', vendorController.financeDashboard);

router.get('/vendor/product/products-data', productController.getVendorProducts);

router.get('/vendor/order/orders-data', orderController.getVendorOrderManagement);


router.get('/vendor/rfq/rfq-data', rfqController.getVendorRFQs);

router.get('/vendor/logout', (res, req) => {
  res.render('company/login');
});

module.exports = router;
