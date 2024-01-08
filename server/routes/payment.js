const express = require('express');
const router = express.Router();

const { newCoupon, applyDiscount , allCoupons ,deleteCoupon } = require('../controllers/payment');


router.post('/coupon/new', newCoupon)
router.get('/discount', applyDiscount)
router.get('/coupon/all', allCoupons)
router.delete('/coupon/:id', deleteCoupon)

module.exports = router;