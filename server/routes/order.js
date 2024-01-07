const express = require('express');
const router = express.Router()

const { newOrder } = require('../controllers/order');


router.post('/new', newOrder);


module.exports = router;