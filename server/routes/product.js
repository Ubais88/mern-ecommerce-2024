const express = require('express');
const router = express.Router();

const { newProduct, getLatestProducts, getAllCategories, getAdminProducts, getSingleProduct, deleteProduct, getAllProducts, updateProduct } = require('../controllers/product');
const singleUpload = require('../middlewares/multer.js'); 

router.post('/new', singleUpload, newProduct);
router.get("/latest", getLatestProducts);
router.get("/categories", getAllCategories);
router.get("/admin-products", getAdminProducts);
router.get("/getdetails/:id", getSingleProduct);
router.put("/updateproduct/:id", singleUpload, updateProduct);
router.delete("/:id", deleteProduct);
router.get("/all", getAllProducts);




module.exports = router;
