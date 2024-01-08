const { myCache } = require("../config/cache");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const { calculatePercentage } = require("../utils/features");

exports.getDashoboardStats = async (req, res) => {
  try {
    let stats;

    if (myCache && myCache.has("admin-stats")) {
      stats = JSON.parse(myCache.get("admin-stats"));
    } else {
      const today = new Date();

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setDate(sixMonthsAgo.getMonth() - 6)

      const thisMonth = {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today,
      };

      const lastMonth = {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      };

      const thisMonthProductsPromise = Product.find({
        createdAt: {
          $gte: thisMonth.start,
          $lte: thisMonth.end,
        },
      });

      const lastMonthProductsPromise = Product.find({
        createdAt: {
          $gte: lastMonth.start,
          $lte: lastMonth.end,
        },
      });

      const thisMonthUsersPromise = User.find({
        createdAt: {
          $gte: thisMonth.start,
          $lte: thisMonth.end,
        },
      });

      const lastMonthUsersPromise = User.find({
        createdAt: {
          $gte: lastMonth.start,
          $lte: lastMonth.end,
        },
      });

      const thisMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: thisMonth.start,
          $lte: thisMonth.end,
        },
      });

      const lastMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: lastMonth.start,
          $lte: lastMonth.end,
        },
      });

      const lastSixMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: sixMonthsAgo,
          $lte: today,
        },
      });

      const latestTransactionsPromise = Order.find({}).select(['orderItems' , 'discount' , 'total' , 'status']).limit(4)


      const [
        thisMonthProducts,
        thisMonthUsers,
        thisMonthOrders,
        lastMonthProducts,
        lastMonthUsers,
        lastMonthOrders,
        productsCount,
        usersCount,
        allOrders,
        lastSixMonthOrders,
        categories,
        femaleUsersCount,
        latestTransaction
      ] = await Promise.all([
        thisMonthProductsPromise,
        thisMonthUsersPromise,
        thisMonthOrdersPromise,
        lastMonthProductsPromise,
        lastMonthUsersPromise,
        lastMonthOrdersPromise,
        Product.countDocuments(),
        User.countDocuments(),
        Order.find({}).select("total"),
        lastSixMonthOrdersPromise,
        Product.distinct("category"),
        User.countDocuments({gender: "female"}),
        latestTransactionsPromise
      ]);

      const thisMonthRevenue = thisMonthOrders.reduce(
        (total, order) => total + (order.total || 0),
        0
      );
  
      const lastMonthRevenue = lastMonthOrders.reduce(
        (total, order) => total + (order.total || 0),
        0
      );



      const changePercent = {
        revenue: calculatePercentage(thisMonthRevenue , lastMonthRevenue) ,
        product:calculatePercentage(
            thisMonthProducts.length,
            lastMonthProducts.length
        ),
        user:calculatePercentage(
            thisMonthUsers.length,
            lastMonthUsers.length
          ),
        order:calculatePercentage(
            thisMonthOrders.length,
            lastMonthOrders.length
          )

      }

      const revenue =  allOrders.reduce(
        (total, order) => total + (order.total || 0),
        0
      );

      const count = {
        revenue,
        product:productsCount,
        user:usersCount,
        order:allOrders.length
      }

      const orderMonthsCount = new Array(6).fill(0);
      const orderMonthlyRevenue = new Array(6).fill(0);

      lastSixMonthOrders.forEach(( order ) => {
        const creationDate = order.createdAt;
        const monthDiff = today.getMonth() - creationDate.getMonth();
        if(monthDiff < 6){
            orderMonthsCount[6 - monthDiff - 1] += 1;
            orderMonthlyRevenue[6 - monthDiff - 1] += order.total;
        }
      })

      const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));

      const categoriesCount = await Promise.all(categoriesCountPromise);
      const categoryCount = []
      categories.forEach((category , i) => {
        categoryCount.push({
            [category]:Math.round((categoriesCount[i] / productsCount) * 100),
        })
      })

      const userRatio = {
        male: usersCount - femaleUsersCount,
        female: femaleUsersCount
      }

      const modifiedLatestTransactions = latestTransaction.map((i) => ({
        _id:i._id,
        discount:i.discount,
        amount:i.total,
        quantity:i.orderItems.length,
        status:i.status,
      }))


      stats = {
        categoryCount,
        changePercent,
        count,
        chart:{
            order: orderMonthsCount,
            revenue: orderMonthlyRevenue
        },
        userRatio,
        latestTransaction:modifiedLatestTransactions
      }

      if (myCache) {
        myCache.set("admin-stats", JSON.stringify(stats));
      } else {
        console.error("myCache is not initialized correctly");
      }
    }

    res.status(200).json({
      success: true,
      data: stats,
      message: "All Stats successfully fetched",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong",
    });
  }
};

exports.getPieChart = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong",
    });
  }
};

exports.getBarChart = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong",
    });
  }
};

exports.getLineChart = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong",
    });
  }
};
