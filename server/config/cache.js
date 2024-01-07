const NodeCache = require('node-cache');
const Product = require("../models/product");


exports.myCache = new NodeCache();

// module.exports = myCache;

exports.invalidateCache = async({ product , order , admin }) => {
    if(product){
        const productKeys = ["latest-products", "categories" , "all-products" , ""];
        const products = await Product.find({}).select("_id");

        products.forEach((i) => {
            productKeys.push(`product-${i._id}`)
        });

        this.myCache.del(productKeys)
    }
    if(order){}
    if(admin){}
}