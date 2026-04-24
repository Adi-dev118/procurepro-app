const express = require('express');
const adminController = require('./../controllers/admin');
const authController = require('./../controllers/authentication');
const userController = require('./../controllers/users');
const productController = require('./../controllers/product');
const orderController = require('./../controllers/order');
const disputeController = require('./../controllers/disputes');
const { route } = require('./users');
const router = express.Router();

router.get('/admin/dashboard', authController.restrictTo('admin'), adminController.adminDashboard);

router.get('/admin/users', authController.restrictTo('admin'), adminController.userDashboard);

router.get('/admin/user/suppliers-data', userController.getSuppliers);
router.get('/admin/user/users-data', userController.getAllUsers);
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
router.get('/admin/dispute/dispute-data', disputeController.getDisputes);
router.get('/admin/product/product-data', productController.getProducts);

router.get(
  '/admin/suppliers',
  authController.restrictTo('admin'),
  adminController.supplierDashboard,
);

router.get('/admin/products', authController.restrictTo('admin'), adminController.productDashboard);

router.get('/admin/orders', authController.restrictTo('admin'), adminController.orderDashboard);

router.get(
  '/admin/disputes',
  authController.restrictTo('admin'),
  adminController.disputedDashboard,
);

router.get('/admin/settings', authController.restrictTo('admin'), adminController.adminSettings);
router.get('/admin/supplier-details/:supplierId', (req, res) => {
  res.render('admin/supplier-detail');
});

module.exports = router;
