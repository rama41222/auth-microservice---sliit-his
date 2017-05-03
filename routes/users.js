const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Prescription = require('../models/prescription');

//register a user
router.post('/register',(req,res,next) => {

  let fname = req.body.fullname;
  let nameArr = fname.split(" ");
  var unameString = "p";
  if(nameArr[(nameArr.length-2)] ){
      var emailString = nameArr[(nameArr.length-2)] + "." + nameArr[(nameArr.length-1)] + "@his.sliit.lk";
  }else {

      var emailString = unameString + "." + nameArr[(nameArr.length-1)] + "@his.sliit.lk";
  }


  for(var i = 0; i < nameArr.length; i++){
    unameString = unameString + nameArr[i].substring(0,3);
  }

  unameString = unameString.toLowerCase();
  emailString = emailString.toLowerCase();

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

    if(user == null){
      User.addUser(newUser,(err, user)=>{
        if(err){

          res.json({success:false, msg:"Failed to register user " ,err : err});

        } else {

          res.json({success:true, msg:"Successfully Registered the User"});


        }

      });

    }else{
      res.json({success:false, msg:"User Already Registered"});

    }

  });


});

//Authenticate a user
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

  //secure test route
  router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next) => {
    res.json({user: req.user});
  });

  //Display all the users
  router.get('/',(req,res,next) => {
    User.getAllUsers((err,users) => {
      if(err) throw err;

      if(users){

          return res.json({success:true, userlist: users });
      }else{

          return res.json({success:false, msg: "No Users Found"});
      }
    });

  });

  //update an existing user
  router.put('/:username',(req,res,next) => {
    let username = req.params.username;
    User.getUserByUsername(username,(err,user)=>{

      if(err) throw err;

      if(!user){
        return res.json({success:false, msg: "User not found!"});

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
        user.password = req.body.password;

      User.updateUser(user,(err,updatedUser)=>{
        if(err){
         return res.json({success:false, msg: "User not found!"});
       }else{

         return res.json({success:true, msg: "Successfully updated the user"});
       }

      });

    });

  });

  //Delete an exisitng user
  router.delete('/',(req,res,next) => {
    let username = req.body.username;
      User.removeUser(username,(err,user) => {

        if(err) throw err;
        if(user){
          return res.json({success:true, msg: "User Removed Successfully!"});
        }else{
            return res.json({success:false, msg: "Operation failed!"});

        }
      });

  });



//Prescription routes
  router.get('/:username/prescriptions',(req,res,next)=>{
          let username = req.params.username;

          User.getUserByUsername(username, (err,user) =>{
            if (err) throw err;

            if(user){
              Prescription.getAllPresciptionsByUsername(user._id,(err,prescriptions) => {

                  if(err) throw err;

                  if(prescriptions){
                        return res.json({success:true, prescriptionsList: prescriptions });
                  }else{
                        return res.json({success:false, msg : "No prescriptons to display"});
                  }

              });

            }else{
                    return res.json({success:false, msg : "Invalid username"});
            }

          });
  });

  router.post('/:username/prescriptions',(req,res,next)=>{
    let username = req.params.username;

       User.getUserByUsername(username, (err,user) =>{
        console.log(err);
         if (err) throw err;

         if(user.position.toLowerCase().includes("doctor")){

           user_id = user._id;
           let fullname = req.body.fullname;
           let age = req.body.age;
           let prescribed_drugs = req.body.prescribed_drugs;

           var pid = "p-";
           let nameArr = fullname.trim().split(" ");

           for(var i = 0; i < nameArr.length; i++){
             pid = pid + nameArr[i].substring(0,3);
           }
           var d = new Date().getFullYear();
           let birthYear  = d - age;
           pid = pid.toLowerCase()+age+"-"+birthYear;

           let newPrescription = new Prescription({
               pid:pid,
               fullname:fullname,
               age:age,
               created_date:new Date(),
               prescribed_drugs : prescribed_drugs,
               physician : user_id

             });

             Prescription.addPrescription(newPrescription,(err, prescription)=>{
               if(err){
                 res.json({success:false, msg:"Failed to add the prescription " , err : err});

               } else {
                 res.json({success:true, msg:"Successfully saved the prescription"});

               }

             });

         }else{
              return res.json({success:false, msg: "This user is not authorized to create prescriptions"});
         }

       });

  });

  router.put('/:username/prescriptions/:id',(req,res,next)=>{


  });

  router.delete('/:username/prescriptions',(req,res,next)=>{


  });

  module.exports = router;
