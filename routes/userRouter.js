const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')


router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/profile/:id', authMiddleware, userController.getProfile);
router.put('/profile/:id', authMiddleware, userController.profileUpdate);
router.put('/profile/:id/avatar', authMiddleware, userController.avatarUpdate);
router.put('/:id', authMiddleware, userController.changePassword);
router.delete('/:id', authMiddleware, userController.delete);
router.get('/', adminMiddleware, userController.getAllUsers);


router.post('/check', userController.check);
router.post('/confirm-email', userController.sendMailTo);
router.get('/confirm', userController.confirmMail);
router.get('/refreshToken', userController.regenerateToken);
router.post('/resetPassword', userController.resetPassword);


//rebuild confirmation email, confirm, refresh token, reset password, and user permission

module.exports = router;