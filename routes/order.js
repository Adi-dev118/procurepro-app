const express = require('express');
const orderController = require('./../controllers/order');
const router = express.Router();

router.route('/new-order/:id').post(orderController.newOrder);
router.route('/:id').get(orderController.getAllOrders);
router.route('/items/:id').get(orderController.getOrderItemsByOrderId);

module.exports = router
