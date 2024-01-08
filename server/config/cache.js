const NodeCache = require('node-cache');
const Product = require("../models/product");
const Order = require("../models/order");


exports.myCache = new NodeCache();

// module.exports = myCache;

exports.invalidateCache = async({ product , order , admin , userId ,orderId}) => {
    if(product){
        const productKeys = ["latest-products", "categories" , "all-products" , ""];
        const products = await Product.find({}).select("_id");

        products.forEach((i) => {
            productKeys.push(`product-${i._id}`)
        });

        this.myCache.del(productKeys)
    }
    if (order) {
        const ordersKeys = [
          "all-orders",
          `my-orders-${userId}`,
          `order-${orderId}`,
        ];
    
        this.myCache.del(ordersKeys);
      }
    if(admin){}
}