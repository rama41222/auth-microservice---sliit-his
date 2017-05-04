const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Drug = require('../models/drug');

// Get all the drugs
router.get('/',(req,res,next)=>{

  Drug.getAllDrugs((err,drugs) => {
    if(err) throw err;

    if(drugs){

        return res.json({success:true, drugList: drugs });
    }else{

        return res.json({success:false, msg: "No Drugs Found"});
    }
  });

});

// New Drug
router.post('/',(req,res,next)=>{

  Drug.getDrugById(id,(err,drug) =>{

    if(err) throw err;

    if(drug == null){

      User.addDrug(drug,(err, drug)=>{
        if(err){

          res.json({success:false, msg:"Failed to register the drug " ,err : err});

        } else {

          res.json({success:true, msg:"Successfully added the drug to the database"});

        }

      });

    }else{
      res.json({success:false, msg:"This Drug is Already present in the database"});

    }

  });

});

// Update a drug
router.put('/:id',(req,res,next)=>{


});

//Remove Drug
router.delete('/',(req,res,next)=>{


});

module.exports = router;
