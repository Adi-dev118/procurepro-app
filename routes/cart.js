const express = require('express')
const cartControllers = require('./../controllers/cart');


const router = express.Router();

router.route('/add-items/:id').post(cartControllers.addItems);
router.route('/get-items/').get(cartControllers.getCartItems);
router.route('/delete-items/:id').delete(cartControllers.updateCart);

module.exports = router;