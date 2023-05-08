const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../auth')
const User = require('../models/User')

router.get('/', (req,res) => {
    res.render('welcome')
})

router.get('/dashboard', ensureAuthenticated , (req, res) => {
    res.render('dashboard', {
        name: req.user.username
    })
})

//delete user

module.exports = router;