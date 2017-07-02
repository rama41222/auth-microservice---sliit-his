const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Prescription = require('../models/prescription');
const url = require('url');

//Prescription routes
router.get('/',(req,res,next)=>{

  Prescription.getAllPresciptions((err,prescriptions)=>{
    if(err) throw err;

    if(prescriptions){
      return res.status(200).json({success:true, prescriptionsList: prescriptions });
    }else{
      return res.status(500).json({success:false,msg:"No Prescriptions found!"});
    }

  });

});


router.get('/:searchString',(req,res,next)=>{
  let searchString = req.params.searchString;

  Prescription.prescriptionSearch(searchString,(err,prescriptions) => {

    if(err) throw err;

    if(prescriptions){
      return res.json({success:true, prescriptionsList: prescriptions });
    }else{
      return res.json({success:false, msg : "No prescriptons to display"});
    }

  });


});



router.put('/:_id',(req,res,next)=>{

  let fullname = req.body.fullname;
  let age = req.body.age;

  let prescription_id = req.params._id;

  Prescription.getPrescriptionBy_Id(prescription_id,(err, prescription)=>{

    if(err) throw err;

    if(!prescription){
      res.json({success:false, msg:"Prescription Not Found" , err : err});
    } else {
      console.log(prescripton)
      var nameArr = [];
      var pid = "p-";
      if(fullname){
        nameArr = fullname.trim().split(" ");
      }
      for(var i = 0; i < nameArr.length; i++){
        pid = pid + nameArr[i].substring(0,3);
      }
      var d = new Date().getFullYear();
      let birthYear  = d - age;
      pid = pid.toLowerCase()+age+"-"+birthYear;

      prescription.pid = pid;
      prescription.fullname = fullname;
      prescription.age = age;
      prescription.created_date = new Date();
      prescription.prescribed_drugs = req.body.prescribed_drugs;

      Prescription.updatePrescription(prescription,(err,updatedPrescription)=>{
        if(err){
          return res.json({success:false, msg: "Prescription update Error"});
        }else{
          return res.json({success:true, msg: "Successfully updated the prescription"});
        }

      });

    }

  });

});

// delete a prescription
router.delete('/:id',(req,res,next)=>{

  let prescription_id = req.params.id;

  Prescription.getPrescriptionBy_Id(prescription_id,(err, prescription)=>{
    if (err) throw err;

    if(!prescription){
      res.json({success:false, msg:"Prescription Not Found" , err : err});
    } else {

      Prescription.removePrescription(prescription_id ,(err,updatedPrescription)=>{
        if(err){
          return res.json({success:false, msg: " Prescription Can't be Removed due to an Error"});
        }else{
          return res.json({success:true, msg: "Successfully Deleted the prescription"});
        }
      });
    }
  });


});

// router.put('/:_id/dispense',(req,res,next)=>{
//   let pres_id = req.body.


// });


module.exports = router;
