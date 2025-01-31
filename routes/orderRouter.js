const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const orderController = require('../controllers/orderController')

router.post('/', authMiddleware, orderController.create);
router.get('/', authMiddleware, orderController.getAllUserOrders);
router.get('/:id', authMiddleware, orderController.getOrder);
router.put('/:id', authMiddleware, orderController.changeStatus);

module.exports = router;