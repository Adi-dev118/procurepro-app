const express = require("express");
const router = express.Router();
const vendorController = require("./../controllers/vendor");
const { render } = require("../app");

router.get("/vendor/dashboard", vendorController.vendorDashboard);

router.get("/vendor/products", vendorController.productsDashboard);

router.get("/vendor/rfqs", vendorController.rfqDashboard);

router.get("/vendor/orders", vendorController.orderDashboard);

router.get("/vendor/profile", vendorController.profileDashboard);

router.get("/vendor/finance", vendorController.financeDashboard);

router.get("/vendor/logout", (res, req) => {
    res.render('company/login')
});

module.exports = router;
