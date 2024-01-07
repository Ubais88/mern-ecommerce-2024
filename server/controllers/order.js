const { invalidateCache } = require("../config/cache");
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

    if (
      !shippingInfo ||
      !orderItems ||
      !user ||
      !subtotal ||
      !tax ||
      !total
    ) {
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
