const mongoose = require('mongoose');
//const mail=require('../prototype/middleware/mail');
// const uuid = require('uuid/v4')
// const session = require('express-session')
// const FileStore = require('session-file-store')(session);

const auth = require('./routes/auth');
const users = require('./routes/users');

const express = require('express');

const app = express();

var url = 'mongodb://suicide:giscle123@ds131747.mlab.com:31747/giscle';
mongoose.connect(url, { useNewUrlParser: true },function(err){
  if(err) throw err;
  console.log("Connected");
});
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
  app.use('/user/', apiLimiter);
app.use(express.json());
app.use('/api/users', users,apiLimiter);
app.use('/api/auth', auth,apiLimiter);

const port = process.env.PORT || 4000;
const id   = process.env.ID;


app.listen(port, id, () => console.log(`Listening on port ${port}...`, process.env.DATABASEURL, process.env.vidly_jwtPrivateKey));