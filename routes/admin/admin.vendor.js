const express = require('express');
const router = express.Router();
const authController = require('./../../controllers/authentication');
const adminVendorController = require('./../../controllers/admin/admin.vendor');

router.use(authController.restrictTo('admin'));

router.get('/admin/user/suppliers-data', adminVendorController.getSuppliers);
router.get('/admin/supplier/supplier-data', adminVendorController.getSupplierManagement);
router.get(
  '/admin/supplier/supplier-data/modal-data/:supplierId',
  adminVendorController.getSupplierById,
);
router.put(
  '/admin/supplier/supplier-data/modal-data/:supplierId/suspend',
  adminVendorController.suspendSupplier,
);
router.put(
  '/admin/supplier/supplier-data/modal-data/:supplierId/activate',
  adminVendorController.activateSupplier,
);
router.put(
  '/admin/supplier/supplier-data/modal-data/:supplierId/approve',
  adminVendorController.approveSupplier,
);

module.exports = router;
