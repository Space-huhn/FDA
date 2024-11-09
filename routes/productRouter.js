const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, productController.create);

router.get('/', productController.getAllProducts);

router.get('/:id', productController.getProducts);

router.put('/:id', authMiddleware, productController.updateProduct);

router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
