const express = require('express')
const app = express()
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
require('dotenv').config()
require('./passport-config')(passport)

//connecting to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser : true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to database'))

//ejs
app.set("view engine", "ejs");

//bodyparser
app.use(express.urlencoded({ extended: true }));

//express session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//connect flash
app.use(flash());

//global vars
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg');
    next()
})

//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(3000, console.log('Server started on port 3000'));