const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

//register
router.post('/register',(req,res,next) => {

  let fname = req.body.fullname;
  let nameArr = fname.split(" ");
  var unameString = "P";
  var emailString = nameArr[(nameArr.length-2)] + "." + nameArr[(nameArr.length-1)] + "@his.sliit.lk";

  for(var i = 0; i < nameArr.length; i++){
    unameString = unameString + nameArr[i].substring(0,3);
  }

  let newUser = new User({

    fullname : req.body.fullname,
    surname : req.body.surname,
    dob : req.body.dob,
    doj : new Date(),
    sex : req.body.sex,
    marital_status : req.body.marital_status,
    nationality : req.body.nationality,
    blood_group : req.body.blood_group,
    contact : req.body.contact,
    address : req.body.address,
    position : req.body.position,
    auth_level : req.body.auth_level,
    username : unameString,
    password : req.body.password,
    email : emailString,
  });

  User.addUser(newUser,(err, user)=>{
    if(err){

      res.json({success:false, msg:"Failed to register user"});
      res.end();
    } else {

      res.json({success:true, msg:"Successfully Registered the User"});
      res.end();

    }

  });
});

//Authenticate
router.post('/authenticate',(req,res,next) => {

  const username = req.body.username;
  const password = req.body.password;
  User.getUserByUsername(username,(err,user) =>{

    if(err) throw err;

    if(!user){
      return res.json({success:false, msg: "User not found!"});

    }

    User.comparePassword(password,user.password, (err,isMatch)=>{

      if(err) throw err;

      if(isMatch){
        const token = jwt.sign(user, config.secret,{
          expiresIn: 604800
        });

        res.json({
          success:true,
          token : 'JWT '+token,
          user : {
            id : user._id,
            name : user.name,
            username : user.username,
            email : user.email
          },
          mgs:"Login Success"});

          res.end();
        }else{

          res.json({success:false, msg: "Wrong password"});
          res.end();
        }
      });
    });

  });

  router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next) => {

    res.json({user: req.user});
    res.end();
  });


  module.exports = router;
