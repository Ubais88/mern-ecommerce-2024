const Product = require("../models/product");
const fs = require("fs");
const rm = fs.rm;

exports.newProduct = async (req, res) => {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "something went wrong",
    });
  }
};

exports.getLatestProducts = async (req, res) => {
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

exports.getAllCategories = async (req, res) => {
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

exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      data: products,
      message: "all admin products fetched successfully",
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

exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(402).json({
        success: false,
        message: "Product not found with this id",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
      message: "product details fetched successfully",
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

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock } = req.body;
    const photo = req.file;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (photo) {
      rm(product.photo, () => {
        console.log("old photo Deleted");
      });
      product.photo = photo.path;
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;

    const updateProduct = await product.save();

    res.status(200).json({
      success: true,
      data: updateProduct,
      message: "Product updated successfully",
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

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(402).json({
        success: true,
        message: "Product not found",
      });
    }
    rm(product.photo, () => {
      console.log("photo Deleted");
    });
    const deletedProduct = await Product.deleteOne();
    res.status(200).json({
      success: true,
      data: deletedProduct,
      message: "product deleted successfully",
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

exports.getAllProducts = async (req, res) => {
  try {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    const ProductsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, onlyFilterProducts] = await Promise.all([
      ProductsPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(onlyFilterProducts.length / limit);

    res.status(200).json({
      success: true,
      data: products,
      message: "Product filtered successfully",
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
