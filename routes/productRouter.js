const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', adminMiddleware, productController.create);
router.get('/', productController.getAllProducts);
router.put('/:id', authMiddleware, productController.updateProduct);
router.put('/image/:id', authMiddleware, productController.productImage);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
