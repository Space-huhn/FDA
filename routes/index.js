const express = require('express');
const router = express.Router();
const restaurantRouter = require('./restaurantRouter');
const productRouter = require('./productRouter');
const categoryRouter = require('./categoryRouter');
const userRouter = require('./userRouter');
const orderRouter = require('./orderRouter')
const Op = require('@sequelize/core');

router.use('/user', userRouter)
router.use('/restaurant', restaurantRouter);
router.use('/product', productRouter);
router.use('/category', categoryRouter);
router.use('/order', orderRouter);

module.exports = router;