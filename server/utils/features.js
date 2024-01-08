const Product = require("../models/product");

exports.reduceStock = async (orderItems) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) {
      throw new Error("Product not found");
    }
    product.stock -= order.quantity;
    await product.save();
  }
};

exports.calculatePercentage = (thisMonth, lastMonth) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = (thisMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};


exports.getInventories = async({categories , productsCount}) => {
    const categoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category })
  );

  const categoriesCount = await Promise.all(categoriesCountPromise);
  const categoryCount = [];
  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    });
  });
  
  return categoryCount;
}
