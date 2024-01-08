const express = require('express');
const router = express.Router()

const { newOrder, myOrders, allOrders, getSingleOrder ,updateOrder, deleteOrder } = require('../controllers/order');
const { isAdmin } = require('../middlewares/auth');


router.post('/new', newOrder);
router.get('/my', myOrders);
router.get('/all', isAdmin , allOrders);
router.get('/:id' , getSingleOrder);
router.put('/:id' ,isAdmin , updateOrder);
router.delete('/:id' ,isAdmin , deleteOrder);


module.exports = router;