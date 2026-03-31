const express = require('express');
const router = express.Router();
const companyController = require('./../controllers/company');
const { render } = require('../app');

router.get('/dashboard', companyController.companyDashboard);

router.get('/marketplace', companyController.marketplaceDashboard);

router.get('/rfq', companyController.rfqsDashboard);

router.get('/orders', companyController.ordersDashboard);

router.get('/profile', companyController.profileDashboard);

router.get('/signup', (req, res) => {
    res.render('company/login')
});


router.get('/company/login', (req, res) => {
    res.render('company/login')
});


module.exports = router;
