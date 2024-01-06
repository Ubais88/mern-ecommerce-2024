const express = require('express');
const router = express.Router()

const { newUser, getAllUsers, deleteUser, getUser } = require("../controllers/user.js")
const { isAdmin } = require("../middlewares/auth.js")


router.post('/new', newUser )
router.get('/all', getAllUsers )
router.get('/:id' , getUser )
router.delete('/:id',isAdmin , deleteUser )


module.exports = router;