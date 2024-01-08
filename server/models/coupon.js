const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Please enter the Coupon Code"],
        unique: true,
      },
      amount: {
        type: Number,
        required: [true, "Please enter the Discount Amount"],
      },
})


module.exports = mongoose.model( "Coupon" , couponSchema )