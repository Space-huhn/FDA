const express = require('express');
const router = express.Router();
const restaurantRouter = require('./restaurantRouter');
const productRouter = require('./productRouter');
const categoryRouter = require('./categoryRouter');
const userRouter = require('./userRouter');
const Op = require('@sequelize/core');
// import { Op } from '@sequelize/core';


router.use('/user', userRouter)
router.use('/restaurant', restaurantRouter);
router.use('/product', productRouter);
router.use('/category', categoryRouter);

module.exports = router;


//try modification from another PC








