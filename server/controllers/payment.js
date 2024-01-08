const Coupon = require("../models/coupon");

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
