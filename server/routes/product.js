const express = require('express');
const router = express.Router();

const { newProduct, getLatestProducts } = require('../controllers/product');
const singleUpload = require('../middlewares/multer.js'); 

router.post('/new', singleUpload, newProduct);
router.get("/latest", getLatestProducts);


module.exports = router;
