const express = require('express');
const router = express.Router()

const { getDashoboardStats, getPieChart, getBarChart, getLineChart } = require('../controllers/stats');
const { isAdmin } = require('../middlewares/auth');



router.get("/stats", isAdmin , getDashoboardStats);
router.get("/pie",isAdmin , getPieChart);
router.get("/bar",isAdmin , getBarChart);
router.get("/line",isAdmin , getLineChart);


module.exports = router





