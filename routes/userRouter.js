const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/check', userController.check);
router.get('/profile/:id', authMiddleware, userController.profile);
router.put('/profile/:id', authMiddleware, userController.profileUpdate);
router.post('/confirm-email', userController.sendMailTo);
router.get('/confirm', userController.confirmMail);
router.get('/refreshToken', userController.regenerateToken);
router.post('/resetPassword', userController.resetPassword);


module.exports = router;