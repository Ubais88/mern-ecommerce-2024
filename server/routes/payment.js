const express = require('express');
const router = express.Router();

const { newCoupon, applyDiscount , allCoupons ,deleteCoupon, createPaymentIntent } = require('../controllers/payment');
const { isAdmin } = require('../middlewares/auth');


router.post('/create',createPaymentIntent )
router.post('/coupon/new',isAdmin , newCoupon)
router.get('/discount', applyDiscount)
router.get('/coupon/all',isAdmin , allCoupons)
router.delete('/coupon/:id', isAdmin , deleteCoupon)

module.exports = router;