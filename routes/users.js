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

  User.getUserByUsername(unameString,(err,user) =>{

    if(err) throw err;

    if(!user){
      User.addUser(newUser,(err, user)=>{
        if(err){

          res.json({success:false, msg:"Failed to register user"});

        } else {

          res.json({success:true, msg:"Successfully Registered the User"});


        }

      });

    }else{
      res.json({success:false, msg:"User Already Registered"});

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


        }else{

          res.json({success:false, msg: "Wrong password"});

        }
      });
    });

  });

  router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next) => {

    res.json({user: req.user});

  });

  router.put('/:username',(req,res,next) => {
    let username = req.params.username;
    User.getUserByUsername(username,(err,user)=>{

      if(err) throw err;

      if(!user){
        return res.json({success:false, msg: "User not found!"});

      }

      let fname = req.body.fullname;
      let nameArr = fname.split(" ");
      var unameString = "P";
      var emailString = nameArr[(nameArr.length-2)] + "." + nameArr[(nameArr.length-1)] + "@his.sliit.lk";

      for(var i = 0; i < nameArr.length; i++){
        unameString = unameString + nameArr[i].substring(0,3);
      }

        user.fullname = req.body.fullname;
        user.surname = req.body.surname;
        user.dob = req.body.dob;
        user.doj = new Date();
        user.sex = req.body.sex;
        user.marital_status = req.body.marital_status;
        user.nationality = req.body.nationality;
        user.blood_group = req.body.blood_group;
        user.contact = req.body.contact;
        user.address = req.body.address;
        user.position = req.body.position;
        user.auth_level = req.body.auth_level;
        user.username =  unameString;
        user.password = req.body.password;
        user.email = emailString;


      User.updateUser(user,(err,updatedUser)=>{
        if(err){
          console.log(err);
         return res.json({success:false, msg: "User not found!"});
       }else{

         return res.json({success:true, msg: "Successfully updated the user"});
       }

      });

    });

  });

  router.delete('/',(req,res,next) => {
    let username = req.body.username;
      User.removeUser(username,(err,user) => {
        console.log(err);
        if(err) throw err;
        if(user){
          return res.json({success:true, msg: "User Removed Successfully!"});
        }else{
            return res.json({success:false, msg: "Operation failed!"});

        }
      });

  });

  module.exports = router;
