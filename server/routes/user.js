const express = require('express');
const router = express.Router()

const { newUser, getAllUsers } = require("../controllers/user.js")
const { isAdmin } = require("../middlewares/auth.js")


router.post('/new', newUser )
router.get('/all', isAdmin , getAllUsers )
router.get('/:id' , getUser )


module.exports = router;