const express = require('express');
const router = express.Router();

const { newCoupon, applyDiscount } = require('../controllers/payment');


router.post('/coupon/new', newCoupon)
router.post('/discount', applyDiscount)

module.exports = router;