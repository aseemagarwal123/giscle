

const express = require('express');
const router = express.Router();
//const mongoose = require('mongoose');
var admin = require("firebase-admin");
//const mail=require('../prototype/middleware/mail');
var bodyParser = require('body-parser');
var serviceAccount = require('../service.json');
//app.use(bodyParser.urlencoded({ extended: false }));  



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://retail-users-database.firebaseio.com/",
    databaseAuthVariableOverride: null
  });






router.get('/', async (req, res) => {
    var db = admin.database();
    
    var ref = db.ref('/');
    ref.once("value", function(snapshot) {
    //var ansDict;
    var ansDict={};
    var totalcount=0;
    snapshot.child('BodyCount').forEach(function(c){
    ansDict[c.key]={}
    var sum=0;
    c.forEach(function(d){
      if(!(d.val().count==undefined || d.val().count=="" || d.val().count==null)){
        sum=sum+d.val().count
        totalcount=totalcount+d.val().count;
      }
    });
    ansDict[c.key]=sum;
    });
    var faceFilter={};
    var countGender={'M':0,'F':0};
    snapshot.child('FaceFiltering').forEach(function(c){
      var sum=0;
      c.forEach(function(d){
        var k=d.val().data.Data[2];      
        for(var e in k){
          countGender[k[e].Gender]=countGender[k[e].Gender]+1;
          if(!(k[e].Age in faceFilter))
            faceFilter[k[e].Age]={'M':0,'F':0}
          faceFilter[k[e].Age][k[e].Gender]=faceFilter[k[e].Age][k[e].Gender]+1;
        }
      });

    });
    
    var sum=0;
    sum=countGender['M']+countGender['F'];
    res.send({ansDict,totalcount,faceFilter,countGender,sum});
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    
    
   
    });
    
    router.get('/line/',(req,res)=>{
      var db = admin.database();
      var ref = db.ref('/');
      function pad(num) { 
        return ("0"+num).slice(-2);
      }
    
      function getTimeFromDate(timestamp) {
        var date = new Date(timestamp * 1000);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        return pad(hours)+":"+pad(minutes)+":"+pad(seconds)
      }
      var timeData={'00':0,'01':0,'02':0,'03':0,'04':0,'05':0,'06':0,'07':0,'08':0,'09':0,'10':0,
                     '11':0,'12':0,'13':0,'14':0,'15':0,'16':0,'17':0,'18':0,'19':0,'20':0,
                     '21':0,'22':0,'23':0,'24':0};  
      var l={};
      //var ref = db.ref('/');
      ref.once("value", function(snapshot) {
        snapshot.child('BodyCount').forEach(function(c){
          l[c.key]=Object.assign({},timeData)
          c.forEach(function(d){
            var g=getTimeFromDate(d.val().timestamp)
            //console.log(l[c.key][timeData[g.split(":")[0]]])
            l[c.key][g.split(":")[0]]=l[c.key][g.split(":")[0]]+d.val().count;
          });
        });
        var ansDict={};
    var totalcount=0;
    snapshot.child('BodyCount').forEach(function(c){
    ansDict[c.key]={}
    var sum=0;
    c.forEach(function(d){
      if(!(d.val().count==undefined || d.val().count=="" || d.val().count==null)){
        sum=sum+d.val().count
        totalcount=totalcount+d.val().count;
      }
    });
    ansDict[c.key]=sum;
    });
        
       res.send({l,ansDict,totalcount})
      });
    
    });
    module.exports=router;  