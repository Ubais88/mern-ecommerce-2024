const { stripe } = require("../utils/features");
const Coupon = require("../models/coupon");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(402).json({
        success: false,
        message: "amount is required",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "inr",
    });

    res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      message: "payment created successfully",
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


exports.newCoupon = async (req, res) => {
  try {
    const { coupon, amount } = req.body;

    if (!coupon || !amount) {
      return res.status(402).json({
        success: false,
        message: "All field are required",
      });
    }
    const savedCoupon = await Coupon.create({ code: coupon, amount });

    res.status(200).json({
      success: true,
      data: savedCoupon,
      message: "coupon created successfully",
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

exports.applyDiscount = async (req, res) => {
  try {
    const { coupon } = req.query;

    const discount = await Coupon.findOne({ code: coupon });

    if (!discount) {
      return res.status(400).json({
        success: false,
        message: "coupon is not valid",
      });
    }

    res.status(200).json({
      success: true,
      data: discount,
      message: "coupon created successfully",
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

exports.allCoupons = async (req, res) => {
  try {
    const allCoupon = await Coupon.find();
    res.status(200).json({
      success: true,
      data: allCoupon,
      message: "all coupon fetched successfully",
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

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteCoupon = await Coupon.findByIdAndDelete(id);
    if (!deleteCoupon) {
      return res.status(402).json({
        success: false,
        message: "ID is not valid",
      });
    }
    res.status(200).json({
      success: true,
      data: deleteCoupon,
      message: "coupon deleted successfully",
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


