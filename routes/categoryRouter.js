const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')


router.post('/', adminMiddleware, categoryController.create);

router.get('/', categoryController.getAllCategories);

router.get('/:id', categoryController.getCategory);

router.put('/:id', authMiddleware, categoryController.updateCategory);

router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;