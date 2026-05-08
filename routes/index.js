const express = require('express');

const authController = require('./../controllers/authentication');

const router = express.Router();

/* =================================================
   ADMIN ROUTES
================================================= */

const adminRouter = express.Router();

adminRouter.use(authController.protect, authController.restrictTo('admin'));

adminRouter.use(require('./admin/admin.dashboard'));
adminRouter.use(require('./admin/admin.user'));
adminRouter.use(require('./admin/admin.vendor'));
adminRouter.use(require('./admin/admin.product'));
adminRouter.use(require('./admin/admin.order'));
adminRouter.use(require('./admin/admin.rfq'));
adminRouter.use(require('./admin/admin.dispute'));
adminRouter.use(require('./admin/admin.activities'));

router.use('/admin', adminRouter);

/* =================================================
   VENDOR ROUTES
================================================= */

const vendorRouter = express.Router();

vendorRouter.use(authController.protect, authController.restrictTo('supplier'));

vendorRouter.use(require('./vendor/vendor.dashboard'));
vendorRouter.use(require('./vendor/vendor.product'));
vendorRouter.use(require('./vendor/vendor.order'));
vendorRouter.use(require('./vendor/vendor.rfq'));

router.use('/vendor', vendorRouter);

/* =================================================
   COMPANY ROUTES
================================================= */

const companyRouter = express.Router();

companyRouter.use(authController.protect, authController.restrictTo('customer'));

companyRouter.use(require('./company/company.dashboard'));
companyRouter.use(require('./company/company.product'));
companyRouter.use(require('./company/company.order'));
companyRouter.use(require('./company/company.rfq'));
companyRouter.use(require('./company/company.cart'));

router.use('/company', companyRouter);

module.exports = router;
