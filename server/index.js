const express = require('express');
const app = express();
const  {connectDB}  = require("./config/database");
require('dotenv').config()
app.use(express.json());

const PORT = process.env.PORT || 8000;
connectDB();

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

// using routes


app.get("/", (req, res) => {
  res.send("<h1>Server Is Ready</h1>");
});
