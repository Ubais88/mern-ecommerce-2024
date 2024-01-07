const express = require('express');
const router = express.Router()

const { newOrder, myOrders, allOrders } = require('../controllers/order');
const { isAdmin } = require('../middlewares/auth');


router.post('/new', newOrder);
router.get('/my', myOrders);
router.get('/all', isAdmin , allOrders);


module.exports = router;