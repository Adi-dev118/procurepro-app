const express = require('express');
const cartControllers = require('./../controllers/cart');
const authControllers = require('./../controllers/authentication');

const router = express.Router();


router.use(authControllers.restrictTo('customer'));
router.route('/add-items/').post(cartControllers.addItems);
router.route('/get-items/').get(cartControllers.getCartItems);
router.route('/increase-items/').patch(cartControllers.increaseQuantity);
router.route('/decrease-items/').patch(cartControllers.decreaseQuantity);
router.route('/remove-items/').delete(cartControllers.deleteItem);
router.route('/clear-items/').delete(cartControllers.deleteCart);

module.exports = router;
