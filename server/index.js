const express = require('express');
const app = express();
require('dotenv').config()

// routes
const userRoutes = require("./routes/user");

// DB
const  { connectDB }  = require("./config/database");
connectDB();

app.use(express.json());


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});


// using routes
app.use("/api/v1/user", userRoutes );


app.get("/", (req, res) => {
  res.send("<h1>Server Is Ready</h1>");
});
