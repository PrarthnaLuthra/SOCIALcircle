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
// const mongoose = require("mongoose");
const MongoStore = require('connect-mongo')(session);//to session information into the database
const sassMiddleware=require('node-sass-middleware')

app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle:'extended',
    prefix:'/css'
}))

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

//to store session cookie in the db , MongoStore is used
app.use(session({
    name: 'socialcircle',
    //TODO CHANGE SECRET
    secret: 'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000 * 60 *100)
    },
   

    store: new MongoStore(
        {
            
            mongooseConnection: db,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )

}))

app.use(passport.initialize());
app.use(passport.session())

app.use(passport.setAuthenticatedUser);
// app.use( express.static( "public" ) )
// use express router
app.use(express.static(__dirname + '/public'));
app.use('/', require('./routes'));


app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server: ${err}`)
    }
    console.log(`Server is running on port ${port}`)
})