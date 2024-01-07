const express = require('express');
const router = express.Router()

const { newOrder, myOrders, allOrders, getSingleOrder ,updateOrder } = require('../controllers/order');
const { isAdmin } = require('../middlewares/auth');


router.post('/new', newOrder);
router.get('/my', myOrders);
router.get('/all', isAdmin , allOrders);
router.get('/getdetail/:id' , getSingleOrder);
router.get('/updateorder/:id' , updateOrder);


module.exports = router;