const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

const User = require('../models/User')

router.get('/login', (req,res) => {
    res.render("login")
})

router.get('/register', (req,res) =>{
    res.render("register")
})

router.post('/register', (req,res) => {
    const { email, username, gender, age, password, password2 } = req.body
    let errors = []
    //password checking

    if(password !== password2) {
       errors.push({msg: "Passwords do not match"})
    }

    if(password.length < 6) {
        errors.push({msg : "Password should be at least 6 characters"})
    }

    if(errors.length > 0) {
        res.render('register')
    }
    else {
        User.findOne({email: email})
          .then(user => {
            if(user) {
                //user exists
                errors.push({msg: 'Email is alredy registered'})
                res.render('register')
            }
            else {
                const newUser = new User({
                    email, 
                    username, 
                    gender, 
                    age, 
                    password
                })

                bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) =>{
                    if(err){
                        throw err;
                    }
                    //saved the password to hash
                    newUser.password = hash;
                    //save the user
                    newUser.save()
                     .then(user =>{
                        req.flash('success_msg', 'You are registered now')
                        res.redirect('/users/login')
                     })
                     .catch(err => console.log(err))
                }))
            }
          })  
    }
});

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

//logout handler
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});
module.exports = router;