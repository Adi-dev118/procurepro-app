const express = require('express');
const adminController = require('./../controllers/admin');
const authController = require('./../controllers/authentication');
const userController = require('./../controllers/users');
const productController = require('./../controllers/product');
const orderController = require('./../controllers/order')
const { route } = require('./users');
const router = express.Router();

router.get('/admin/dashboard', authController.restrictTo('admin'), adminController.adminDashboard);

router.get('/admin/users', authController.restrictTo('admin'), adminController.userDashboard);

router.get('/admin/user/suppliers-data', userController.getSuppliers);
router.get('/admin/user/suppliers-pending', userController.getPendingSuppliers);
router.get('/admin/user/users-suspended', userController.getSuspendedUsers);
router.get('/admin/user/users-data', userController.getAllUsers);

router.get('/admin/supplier/supplier-data', userController.getSupplierManagement);

router.get('/admin/order/order-data', orderController.getOrderManagement);

router.get('/admin/product/product-data', (req, res) => {
  console.log('API HIT');
  productController.getProducts(req, res);
});

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

module.exports = router;
