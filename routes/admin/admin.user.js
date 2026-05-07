const express = require('express');
const router = express.Router();
const authController = require('./../../controllers/authentication');
const adminUserController = require('./../../controllers/admin/admin.user');
router.route('/').get(adminUserController.getAllUsers);
router.get('/user/users-data', adminUserController.getAllUsers);
router.put('/user/users-data/modal-data/:userId/suspend', adminUserController.suspendUser);
router.put('/user/users-data/modal-data/:userId/activate', adminUserController.activateUser);
router.put('/user/users-data/modal-data/:userId/approve', adminUserController.approveUser);
router.get('/user/users-data/modal-data/:userId', adminUserController.getUserById);
router.delete('/:id', adminUserController.deleteUser);

module.exports = router;
