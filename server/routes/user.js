const express = require('express');
const router = express.Router()

const { newUser } = require("../controllers/user.js")


router.post('/new', newUser )



module.exports = router;