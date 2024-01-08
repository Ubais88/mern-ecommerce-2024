const express = require('express');
const app = express();
require('dotenv').config()
const morgan = require('morgan');

// routes
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");

// DB
const  { connectDB }  = require("./config/database");
connectDB();



app.use(express.json());
app.use(morgan("dev"));


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});


// using routes
app.use("/api/v1/user", userRoutes );
app.use("/api/v1/product", productRoutes )
app.use("/api/v1/order", orderRoutes )
app.use("/api/v1/payment", paymentRoutes )

app.get("/", (req, res) => {
  res.send("<h1>Server Is Ready</h1>");
});
