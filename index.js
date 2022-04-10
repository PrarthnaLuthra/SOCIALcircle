const express = require("express");
const env = require("./config/environment");
const logger = require("morgan");

const cookieParcer = require("cookie-parser");
const app = express();
require("./config/view-helper")(app);
const port = 8001;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
//used for session cookie and authentication
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
const MongoStore = require("connect-mongo"); //to session information into the database
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");
//setup the chat server to be used with socket.io
const chatServer = require("http").Server(app);

const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);

chatServer.listen(5000);
console.log("chat server is listening on port 5000");
const path = require("path");
if (env.name == "development") {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, "scss"),
      dest: path.join(__dirname, env.asset_path, "css"),
      debug: true,
      outputStyle: "extended",
      prefix: "/css",
    })
  );
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParcer());
app.use(express.static(env.asset_path));

app.use(logger(env.morgan.mode, env.morgan.options));
app.use(expressLayouts);
//make the upload path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));

//extract style and script from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//setting up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//to store session cookie in the db , MongoStore is used
app.use(
  session({
    name: "socialcircle",
    //TODO CHANGE SECRET
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },

    store: MongoStore.create(
      {
        mongoUrl: "mongodb://localhost/chatterbox_development",
        autoRemove: "disabled",
      }
      // function (err) {
      //   console.log(err || "connect-mongodb setup ok");
      // }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);
// app.use( express.static( "public" ) )
// use express router
// app.use(express.static(__dirname + '/public'));
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port ${port}`);
});
