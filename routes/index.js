const express = require('express');
const router = express.Router();
const restaurantRouter = require('./restaurantRouter');
const productRouter = require('./productRouter');
const categoryRouter = require('./categoryRouter');
const userRouter = require('./userRouter');

router.use('/user', userRouter)
// router.use('/product',)
router.use('/restaurant', restaurantRouter);
router.use('/product', productRouter);
router.use('/category', categoryRouter);

module.exports = router;









