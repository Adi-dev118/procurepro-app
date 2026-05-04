const express = require('express');
const adminController = require('./../controllers/admin');
const authController = require('./../controllers/authentication');
const userController = require('./../controllers/users');
const productController = require('./../controllers/product');
const orderController = require('./../controllers/order');
const disputeController = require('./../controllers/disputes');
const { route } = require('./users');
const router = express.Router();

router.use(authController.restrictTo('admin'));

router.get('/api/v1/admin/dashboard-stats', adminController.adminStats);
router.get('/api/v1/admin/users-stats', adminController.userStats);
router.get('/api/v1/admin/vendor-stats', adminController.vendorStats);
router.get('/api/v1/admin/product-stats', adminController.productStats);
router.get('/api/v1/admin/order-stats', adminController.orderStats);
router.get('/api/v1/admin/dispute-stats', adminController.disputeStats);

router.get('/admin/user/suppliers-data', userController.getSuppliers);
router.get('/admin/user/users-data', userController.getAllUsers);
router.get('/admin/user/users-data/recent-activities', adminController.getRecentActivities);
router.get('/admin/user/users-data/activities-data', adminController.getAllActivities);
router.get('/admin/user/users-data/modal-data/:userId', userController.getUserById);
router.put('/admin/user/users-data/modal-data/:userId/suspend', userController.suspendUser);
router.put('/admin/user/users-data/modal-data/:userId/activate', userController.activateUser);
router.put('/admin/user/users-data/modal-data/:userId/approve', userController.approveUser);
router.get('/admin/supplier/supplier-data', userController.getSupplierManagement);
router.get('/admin/supplier/supplier-data/modal-data/:supplierId', userController.getSupplierById);
router.put(
  '/admin/supplier/supplier-data/modal-data/:supplierId/suspend',
  userController.suspendSupplier,
);
router.put(
  '/admin/supplier/supplier-data/modal-data/:supplierId/activate',
  userController.activateSupplier,
);
router.put(
  '/admin/supplier/supplier-data/modal-data/:supplierId/approve',
  userController.approveSupplier,
);

router.get('/admin/order/order-data', orderController.getOrderManagement);
router.get('/admin/order/order-data/order-modal/:orderId', orderController.getOrderProducts);
router.get('/admin/dispute/dispute-data', disputeController.getDisputes);
router.get('/admin/product/product-data', productController.getProducts);



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

router.get('/admin/rfq', (req, res) => {
  res.render('admin/rfqs');
});

router.get('/admin/order-detail/:orderId', (req, res) => {
  res.render('admin/order-detail');
});

router.get('/admin/activities', (req, res) => {
  res.render('admin/activities');
});

module.exports = router;
