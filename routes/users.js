const jwt =require('jsonwebtoken');
const auth=require('../middleware/auth');
const config=require('config');
const _ =require('lodash');
const bcrypt=require('bcrypt');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const mail=require('../middleware/mail.js');
const crypto=require('crypto');




router.get('/', async(req,res)=>{

res.send("welcome and discuss");
});
router.post('/', async (req, res) => {
    console.log("got");
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');


  user=new User(_.pick(req.body,['name','email','password','companyname','companycontact']));
  const salt=await bcrypt.genSalt(10);
   user.password =await bcrypt.hash(user.password,salt);

  await user.save();
 

const token=user.generateAuthToken();
res.header('x-auth-token',token).send(_.pick(user,['_id','name','email']));
});


router.post('/forgotPassword',async (req, res) => {
    if (req.body.email === '') {
    res.status(400).send('email required');
    }
    let user = await User.findOne({ email: req.body.email });
    

    if (!user) {
        console.error('email not in database');
        res.status(403).send('email not in db');
    } else {
    var token = user.generateAuthToken();
    mail({"to":req.body.email,"subject":"change password","text":`http://localhost:3000/api/users/forgotPassword/${token}`});

}

res.header('x-auth-token',token).send(_.pick(user,['_id','name','email']));
});


router.post('/forgotPassword/:token',async (req, res) => {
 
    const token=req.params.token;
    const decoded=jwt.verify(token,"mysecret");
    

    const salt2=await bcrypt.genSalt(10);
    var user = await User.findByIdAndUpdate(decoded._id,
    {
    password :await bcrypt.hash(req.body.password,salt2)

    }, { new: true });


    await user.save();
    res.send(_.pick(user,['_id','name','email']));

});







module.exports=router;  