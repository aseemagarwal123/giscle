const mongoose = require('mongoose');
var admin = require("firebase-admin");
const express = require('express');
const app = express();
//const mail=require('../prototype/middleware/mail');
var bodyParser = require('body-parser');
var serviceAccount = require('./service.json');
app.use(bodyParser.urlencoded({ extended: false }));  



const auth = require('./routes/auth');
const users = require('./routes/users');
const data = require('./routes/data');





var url = process.env.DATABASEURL || 'mongodb://localhost/facecount';
mongoose.connect(url);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    next();
  });
  var RateLimit = require('express-rate-limit');
  // important if behind a proxy to ensure client IP is passed to req.ip
  app.enable('trust proxy'); 
   
  var apiLimiter = new RateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 100,
  });
   
  // only apply to requests that begin with /user/
//app.use('/user/', apiLimiter);
app.use(express.json());
app.use('/api/users', users,apiLimiter);
app.use('/api/auth', auth,apiLimiter);
app.use('/api/data', data,apiLimiter);

const port = process.env.PORT || 3000;
const id   = process.env.ID;


app.listen(port, id, () => console.log(`Listening on port ${port}...`, process.env.DATABASEURL, process.env.vidly_jwtPrivateKey));