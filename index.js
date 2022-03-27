const express = require('express');
const cookieParcer =require('cookie-parser')
const app =express()
const port =8001;
const expressLayouts = require('express-ejs-layouts');
const db =require('./config/mongoose')
//used for session cookie and authentication
const session =require('express-session')
const passport = require('passport')
const passportLocal =require('./config/passport-local-strategy')
const bodyParser = require("body-parser");



app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParcer());
app.use(express.static('./assets'));
app.use(expressLayouts);
//extract style and script from sub pages into the layout
app.set('layout extractStyles',true)
app.set('layout extractScripts',true)



//setting up view engine
app.set('view engine','ejs')
app.set('views','./views')


app.use(session({
    name: 'socialcircle',
    //TODO CHANGE SECRET
    secret: 'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000 * 60 *100)
    }

}))

app.use(passport.initialize());
app.use(passport.session())

// use express router
app.use('/', require('./routes'));


app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server: ${err}`)
    }
    console.log(`Server is running on port ${port}`)
})