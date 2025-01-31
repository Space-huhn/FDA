const express = require('express');
const router = express.Router();
const restaurantsController = require('../controllers/restaurantController');
const adminMiddleware = require('../middleware/adminMiddleware')


router.post('/', adminMiddleware, restaurantsController.create);
router.put('/image/:id', adminMiddleware, restaurantsController.restaurantImage);
router.get('/', restaurantsController.getAllRestaurants);
router.get('/:id', restaurantsController.getRestaurant);
router.put('/:id', adminMiddleware, restaurantsController.updateRestaurant);
router.delete('/:id', adminMiddleware, restaurantsController.deleteRestaurant);

module.exports = router;