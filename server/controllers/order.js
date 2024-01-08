const { invalidateCache, myCache } = require("../config/cache");
const Order = require("../models/order");
const { reduceStock } = require("../utils/features");

exports.myOrders = async (req, res) => {
  try {
    const { id } = req.query;
    let orders;

    if (myCache && myCache.has(`my-order-${id}`)) {
      orders = JSON.parse(myCache.get(`my-order-${id}`));
    } else {
      orders = await Order.find({ user: id });
      if (myCache) {
        myCache.set(`my-order-${id}`, JSON.stringify(orders));
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

exports.allOrders = async (req, res) => {
  try {
    let allOrders;
    if (myCache && myCache.has(`all-orders`)) {
      allOrders = JSON.parse(myCache.get(`all-orders`));
    } else {
      allOrders = await Order.find().populate("user", "name");
      if (myCache) {
        myCache.set(`all-orders`, JSON.stringify(allOrders));
      } else {
        console.error("myCache is not initialized correctly");
      }
    }

    res.status(200).json({
      success: true,
      data: allOrders,
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

exports.getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    let order;
    if (myCache && myCache.has(`order-${id}`)) {
      order = JSON.parse(myCache.get(`order-${id}`));
    } else {
      order = await Order.findById(id);
      if (!order) {
        return res.status(402).json({
          success: false,
          message: "Order not found",
        });
      }
      if (myCache) {
        myCache.set(`order-${id}`, JSON.stringify(order));
      } else {
        console.error("myCache is not initialized correctly");
      }
    }

    res.status(200).json({
      success: true,
      data: order,
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
    await invalidateCache({
        product: true,
        order: true,
        admin: true,
        userId: user,
        productId: savedOrder.orderItems.map((i) => i.productId),
      });

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

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found/invalid id",
      });
    }

    switch (order.status) {
      case "Processing":
        order.status = "Shipped";
        break;
      case "Shipped":
        order.status = "Delivered";
        break;
      default:
        order.status = "Delivered";
        break;
    }
    const updatedOrder = await order.save();
    await invalidateCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: order._id,
      });

    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: "Order proccessed successfully",
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

exports.deleteOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found/invalid id",
        });
      }
  
      const updatedOrder = await order.deleteOne();
      await invalidateCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id),
      });
  
      res.status(200).json({
        success: true,
        data: updatedOrder,
        message: "Order deleted successfully",
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