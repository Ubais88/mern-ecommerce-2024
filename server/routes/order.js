const express = require('express');
const router = express.Router()

const { newOrder, myOrders } = require('../controllers/order');


router.post('/new', newOrder);
router.get('/my', myOrders);


module.exports = router;