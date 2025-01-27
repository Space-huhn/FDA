const express = require("express");
const router = express.Router();

const restaurantController = require('../controllers/orderController')

router.post('/', restaurantController.create);


module.exports = router;