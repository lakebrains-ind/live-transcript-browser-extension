const express = require("express");
const app = express();
var session = require("express-session");
var cors = require("cors");
// app.use(express.urlencoded());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
var ApiRoutes =require('./controllers/apiConttroller')
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use('/api',ApiRoutes)




app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(express.json());

module.exports = app;
