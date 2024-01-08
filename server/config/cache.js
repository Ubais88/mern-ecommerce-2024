const NodeCache = require('node-cache');


exports.myCache = new NodeCache();


exports.invalidateCache = async({ product , order , admin , userId ,orderId , productId }) => {
    if(product){
        const productKeys = ["latest-products", "categories" , "all-products" , `product-${productId}` ];
        console.log("first",productId)

        // if (typeof productId === "string") productKeys.push(`product-${productId}`);

        // if (typeof productId === "object")
        //   productId.forEach((i) => productKeys.push(`product-${i}`));

          
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
      if (admin) {
        myCache.del([
          "admin-stats",
          "admin-pie-charts",
          "admin-bar-charts",
          "admin-line-charts",
        ]);
      }
}