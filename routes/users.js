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
    contact : [req.body.contact],
    address : [req.body.address],
    position : req.body.position,
    auth_level : req.body.auth_level,
    username : unameString,
    password : req.body.password,
    email : emailString,
  });

  User.addUser(newUser,(err, user)=>{
    if(err){

      res.json({success:false, msg:"Failed to register user"});
    } else {

      res.json({success:true, msg:"Successfully Registered the User"});

    }

  });
});

//Authenticate
router.post('/authenticate',(req,res,next) => {

  const username = req.body.username;
  const password = req.body.password;
  console.log(authenticate);
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
        }else{

          res.json({success:false, msg: "Wrong password"});

        }
      });
    });

  });


  //profile
  router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next) => {

    res.json({user: req.user});

  });

  router.get('/aliens',(req,res,next) => {
    var aliens = [
      {name:"a1",dob:new Date("November 31, 2000"),gender:"alien",salary:23455},
      {name:"a21",dob:new Date("March 30, 2001"),gender:"alien",salary:232423.232},
      {name:"a1e",dob:new Date("August 23, 2001"),gender:"alien",salary:2345.35},
      {name:"a1f",dob:new Date("January 11,  1992"),gender:"alien",salary:2.3455},
      {name:"a1s",dob:new Date("February 20, 1993"),gender:"alien",salary:234.23255},
      {name:"ad1",dob:new Date("May 21, 1943"),gender:"alien",salary:234552.3},
      {name:"as1",dob:new Date("April 14, 1988"),gender:"alien",salary:23455324.},
      {name:"af1",dob:new Date("December 17, 1967"),gender:"alien",salary:5623.455},
      {name:"as1",dob:new Date("September 10, 1900"),gender:"alien",salary:889923.455},
    ];


    res.json({aliens: aliens});

  });

  module.exports = router;
