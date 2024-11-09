const express = require('express');
const router = express.Router();
const restaurantsController = require('../controllers/restaurantController');

router.post('/', restaurantsController.create);

router.get('/', restaurantsController.getAllRestaurants);

router.get('/:id', restaurantsController.getRestaurant);

router.put('/:id', restaurantsController.updateRestaurant);

router.delete('/:id', restaurantsController.deleteRestaurant);

module.exports = router;

