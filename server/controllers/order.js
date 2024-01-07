const { invalidateCache, myCache } = require("../config/cache");
const Order = require("../models/order");
const { reduceStock } = require("../utils/features");

exports.newOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const savedOrder = await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });

    await reduceStock(orderItems);
    await invalidateCache({ product: true, order: true, admin: true });

    res.status(200).json({
      success: true,
      data: savedOrder,
      message: "Order placed successfully",
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

exports.myOrders = async (req, res) => {
  try {
    const { id } = req.query;
    let orders;

    if (myCache && myCache.has(`my-order-${user}`)) {
      orders = JSON.parse(myCache.get(`my-order-${user}`));
    } else {
      orders = await Order.find({ user: id });
      if (myCache) {
        myCache.set(`my-order-${user}`, JSON.stringify(orders));
      } else {
        console.error("myCache is not initialized correctly");
      }
    }

    res.status(200).json({
      success: true,
      data: orders,
      message: " All Order fetched successfully",
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
