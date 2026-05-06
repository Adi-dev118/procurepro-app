const express = require('express');

const router = express.Router();

/* =========================================
   AUTH ROUTES
========================================= */

router.use(
  '/api/v1/auth',
  require('./auth/auth.routes')
);

/* =========================================
   ADMIN ROUTES
========================================= */

router.use(
  '/',
  require('./admin/admin.dashboard.routes')
);

router.use(
  '/',
  require('./admin/admin.users.routes')
);

router.use(
  '/',
  require('./admin/admin.suppliers.routes')
);

router.use(
  '/',
  require('./admin/admin.orders.routes')
);

router.use(
  '/',
  require('./admin/admin.products.routes')
);

router.use(
  '/',
  require('./admin/admin.rfq.routes')
);

router.use(
  '/',
  require('./admin/admin.disputes.routes')
);

/* =========================================
   VENDOR ROUTES
========================================= */

router.use(
  '/',
  require('./vendor/vendor.dashboard.routes')
);

router.use(
  '/',
  require('./vendor/vendor.products.routes')
);

router.use(
  '/',
  require('./vendor/vendor.orders.routes')
);

router.use(
  '/',
  require('./vendor/vendor.rfq.routes')
);

/* =========================================
   COMPANY ROUTES
========================================= */

router.use(
  '/',
  require('./company/company.dashboard.routes')
);

router.use(
  '/',
  require('./company/company.marketplace.routes')
);

router.use(
  '/',
  require('./company/company.orders.routes')
);

router.use(
  '/',
  require('./company/company.cart.routes')
);

router.use(
  '/',
  require('./company/company.rfq.routes')
);

module.exports = router;