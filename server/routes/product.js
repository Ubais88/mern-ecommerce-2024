const express = require('express');
const router = express.Router();

const { newProduct, getLatestProducts, getAllCategories, getAdminProducts, getSingleProduct } = require('../controllers/product');
const singleUpload = require('../middlewares/multer.js'); 

router.post('/new', singleUpload, newProduct);
router.get("/latest", getLatestProducts);
router.get("/categories", getAllCategories);
router.get("/admin-products", getAdminProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", singleUpload, updateProduct);


module.exports = router;
