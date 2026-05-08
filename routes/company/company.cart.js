const express = require('express');
const router = express.Router();
const compayCartController = require('./../../controllers/company/company.cart');
const authController = require('../../controllers/authentication');
router
  .route('/api/v1/cart')
  .get(compayCartController.getCartItems)
  .post(compayCartController.addItems)
  .delete(compayCartController.deleteCart);
  
router.route('/api/v1/cart/increase-items').patch(compayCartController.increaseQuantity);
router.route('/api/v1/cart/decrease-items').patch(compayCartController.decreaseQuantity);
router.route('/api/v1/cart/remove-items').delete(compayCartController.deleteItem);

module.exports = router;
