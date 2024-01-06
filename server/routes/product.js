const express = require('express');
const router = express.Router();

const { newProduct, getLatestProducts, getAllCategories } = require('../controllers/product');
const singleUpload = require('../middlewares/multer.js'); 

router.post('/new', singleUpload, newProduct);
router.get("/latest", getLatestProducts);
router.get("/categories", getAllCategories);

module.exports = router;
