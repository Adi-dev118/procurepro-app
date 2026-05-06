const express = require('express');
const adminController = require('./../controllers/admin');
const authController = require('./../controllers/authentication');
const userController = require('./../controllers/users');
const productController = require('./../controllers/product');
const orderController = require('./../controllers/order');
const disputeController = require('./../controllers/disputes');
const rfqController = require('./../controllers/rfq');
const { route } = require('./users');
const router = express.Router();

router.use(authController.restrictTo('admin'));


router.get('/api/v1/admin/all-rfq-data', rfqController.getAllRfqs);
router.get('/api/v1/admin/rfq/:id/items', rfqController.getRfqItems);
router.get('/api/v1/admin/rfq/:id/quotes', rfqController.getRfqQuotes );
router.get('/api/v1/admin/rfq/:id/specifications', rfqController.getRfqSpecifications );


router.get('/admin/user/users-data/recent-activities', adminController.getRecentActivities);
router.get('/admin/user/users-data/activities-data', adminController.getAllActivities);

router.get('/admin/dispute/dispute-data', disputeController.getDisputes);



router.get('/admin/settings', authController.restrictTo('admin'), adminController.adminSettings);
router.get('/admin/supplier-details/:supplierId', (req, res) => {
  res.render('admin/supplier-detail');
});

router.get('/admin/dashboard', (req, res) => {
  res.render('admin/dashboard');
});

router.get('/admin/users', (req, res) => {
  res.render('admin/users');
});

router.get('/admin/suppliers', (req, res) => {
  res.render('admin/suppliers');
});

router.get('/admin/products', (req, res) => {
  res.render('admin/products');
});

router.get('/admin/orders', (req, res) => {
  res.render('admin/orders');
});

router.get('/admin/disputes', (req, res) => {
  res.render('admin/disputes');
});

router.get('/admin/rfqs', (req, res) => {
  res.render('admin/rfqs');
});

router.get('/admin/order-detail/:orderId', (req, res) => {
  res.render('admin/order-detail');
});

router.get('/admin/activities', (req, res) => {
  res.render('admin/activities');
});

module.exports = router;
