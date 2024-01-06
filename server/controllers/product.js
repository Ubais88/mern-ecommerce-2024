const Product = require('../models/product')
const fs = require('fs');
const rm = fs.rm;


exports.newProduct = async (req , res) => {
  try {
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    console.log(name, category, price, stock, photo);

    if (!photo) {
      return res.status(400).json({
        success: false,
        message: "Please add Photo",
      });
    }

    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log("Deleted");
      });
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const savedProduct = await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
    });

    res.status(200).json({
      success: true,
      data: savedProduct,
      message: "Product ceated successfully",
    });

  } 
  catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "something went wrong",
    });
  }
};


exports.getLatestProducts = async (req , res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      data: products,
      message: "latest 5 products fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "something went wrong",
    });
  }
};

exports.getAllCategories = async (req , res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json({
      success: true,
      data: categories,
      message: "all categories fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "something went wrong",
    });
  }
};