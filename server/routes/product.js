const express = require('express');
const router = express.Router();

const { newProduct } = require('../controllers/product');
const singleUpload = require('../middlewares/multer.js'); 

router.post('/new', singleUpload, newProduct);


module.exports = router;
