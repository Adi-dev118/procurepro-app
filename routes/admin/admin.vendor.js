const express = require('express');
const router = express.Router();
const authController = require('./../../controllers/authentication');
const adminVendorController = require('./../../controllers/admin/admin.vendor');

router.use(authController.restrictTo('admin'));

router.get('/user/suppliers-data', adminVendorController.getSuppliers);
router.get('/supplier/supplier-data', adminVendorController.getSupplierManagement);
router.get(
  '/supplier/supplier-data/modal-data/:supplierId',
  adminVendorController.getSupplierById,
);
router.put(
  '/supplier/supplier-data/modal-data/:supplierId/suspend',
  adminVendorController.suspendSupplier,
);
router.put(
  '/supplier/supplier-data/modal-data/:supplierId/activate',
  adminVendorController.activateSupplier,
);
router.put(
  '/supplier/supplier-data/modal-data/:supplierId/approve',
  adminVendorController.approveSupplier,
);

module.exports = router;
