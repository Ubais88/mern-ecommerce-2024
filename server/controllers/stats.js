const { myCache } = require("../config/cache");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const { calculatePercentage, getInventories, getChartData } = require("../utils/features");

exports.getDashoboardStats = async (req, res) => {
  try {
    let stats;

    if (myCache && myCache.has("admin-stats")) {
      stats = JSON.parse(myCache.get("admin-stats"));
    } else {
      const today = new Date();

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setDate(sixMonthsAgo.getMonth() - 6);

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

      const latestTransactionsPromise = Order.find({})
        .select(["orderItems", "discount", "total", "status"])
        .limit(4);

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
        latestTransaction,
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
        User.countDocuments({ gender: "female" }),
        latestTransactionsPromise,
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
        revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
        product: calculatePercentage(
          thisMonthProducts.length,
          lastMonthProducts.length
        ),
        user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
        order: calculatePercentage(
          thisMonthOrders.length,
          lastMonthOrders.length
        ),
      };

      const revenue = allOrders.reduce(
        (total, order) => total + (order.total || 0),
        0
      );

      const count = {
        revenue,
        product: productsCount,
        user: usersCount,
        order: allOrders.length,
      };

      const orderMonthsCount = new Array(6).fill(0);
      const orderMonthlyRevenue = new Array(6).fill(0);

      lastSixMonthOrders.forEach((order) => {
        const creationDate = order.createdAt;
        const monthDiff =
          (today.getMonth() - creationDate.getMonth() + 12) % 12;

        if (monthDiff < 6) {
          orderMonthsCount[6 - monthDiff - 1] += 1;
          orderMonthlyRevenue[6 - monthDiff - 1] += order.total;
        }
      });
      
      const categoryCount = await getInventories({ categories, productsCount });

      const userRatio = {
        male: usersCount - femaleUsersCount,
        female: femaleUsersCount,
      };

      const modifiedLatestTransactions = latestTransaction.map((i) => ({
        _id: i._id,
        discount: i.discount,
        amount: i.total,
        quantity: i.orderItems.length,
        status: i.status,
      }));

      stats = {
        categoryCount,
        changePercent,
        count,
        chart: {
          order: orderMonthsCount,
          revenue: orderMonthlyRevenue,
        },
        userRatio,
        latestTransaction: modifiedLatestTransactions,
      };

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
    let charts;

    if (myCache && myCache.has("admin-pie-charts")) {
      charts = JSON.parse(myCache.get("admin-pie-charts"));
    } else {
      const allOrderPromise = Order.find({}).select([
        "total",
        "discount",
        "subtotal",
        "tax",
        "shippingCharges",
      ]);

      const [
        processingOrder,
        shippedOrder,
        deliveredOrder,
        categories,
        productsCount,
        outOfStock,
        allOrders,
        allUsers,
        adminUsers,
        customerUsers,
      ] = await Promise.all([
        Order.countDocuments({ status: "Processing" }),
        Order.countDocuments({ status: "Shipped" }),
        Order.countDocuments({ status: "Delivered" }),
        Product.distinct("category"),
        Product.countDocuments(),
        Product.countDocuments({ stock: 0 }),
        allOrderPromise,
        User.find({}).select(["dob"]),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ role: "user" }),
      ]);
      const orderFullFillment = {
        processing: processingOrder,
        shipped: shippedOrder,
        delivered: deliveredOrder,
      };

      const productCategories = await getInventories({
        categories,
        productsCount,
      });

      const stockAvailability = {
        inStock: productsCount - outOfStock,
        outOfStock,
      };

      const grossIncome = allOrders.reduce(
        (prev, order) => prev + (order.total || 0),
        0
      );

      const discount = allOrders.reduce(
        (prev, order) => prev + (order.discount || 0),
        0
      );

      const productionCost = allOrders.reduce(
        (prev, order) => prev + (order.shippingCharges || 0),
        0
      );

      // tax === barbaad (assume)
      const burnt = allOrders.reduce(
        (prev, order) => prev + (order.discount || 0),
        0
      );

      const marketingCost = Math.round(grossIncome * (30 / 100));
      const netMargin =
        grossIncome - discount - productionCost - burnt - marketingCost;

      const revenueDistribution = {
        netMargin,
        discount,
        productionCost,
        burnt,
        marketingCost,
      };

      const usersAgeGroup = {
        teen: allUsers.filter((i) => i.age < 20).length,
        adult: allUsers.filter((i) => i.age >= 20 && i.age <= 40).length,
        old: allUsers.filter((i) => i.age > 40).length,
      };

      const adminCustomer = {
        admin: adminUsers,
        customer: customerUsers,
      };

      charts = {
        orderFullFillment,
        productCategories,
        stockAvailability,
        revenueDistribution,
        usersAgeGroup,
        adminCustomer,
      };

      if (myCache) {
        myCache.set("admin-pie-charts", JSON.stringify(charts));
      } else {
        console.error("myCache is not initialized correctly");
      }
    }

    res.status(200).json({
      success: true,
      data: charts,
      message: "Pie chart data fetched successfully",
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

exports.getBarChart = async (req, res) => {
  try {
    let charts;

    if (myCache && myCache.has("admin-bar-charts")) {
      charts = JSON.parse(myCache.get("admin-bar-charts"));
    } else {
      const today = new Date();

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setDate(sixMonthsAgo.getMonth() - 6);

      const twelveMonthsAgo = new Date();
      sixMonthsAgo.setDate(twelveMonthsAgo.getMonth() - 12);

      const sixMonthProductPromise = Product.find({
        createdAt: {
          $gte: sixMonthsAgo,
          $lte: today,
        },
      }).select("createdAt")

      const sixMonthUsersPromise = User.find({
        createdAt: {
          $gte: sixMonthsAgo,
          $lte: today,
        },
      }).select("createdAt")

      const twelveMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: twelveMonthsAgo,
          $lte: today,
        },
      }).select("createdAt")

      const [products, users, orders] = await Promise.all([
        sixMonthProductPromise,
        sixMonthUsersPromise,
        twelveMonthOrdersPromise,
      ]);

      const productCounts = getChartData({length:6 , today , docArr:products})
      const usersCounts = getChartData({length:6 , today , docArr:users})
      const ordersCounts = getChartData({length:12 , today , docArr:orders})

      charts = {
        users:usersCounts,
        product:productCounts,
        orders:ordersCounts,
      };

      if (myCache) {
        myCache.set("admin-bar-charts", JSON.stringify(charts));
      } else {
        console.error("myCache is not initialized correctly");
      }
    }

    res.status(200).json({
      success: true,
      data: charts,
      message: "latest 5 products fetched successfully",
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
