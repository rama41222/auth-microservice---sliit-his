const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Drug = require('../models/drug');
const Category = require('../models/category');


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

// seach a drug
router.get('/:searchString',(req,res,next)=>{
  let searchString = req.params.searchString;

  Drug.drugsSearch(searchString,(err,drugs) => {
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

  let username

  Drug.getDrugById(id,(err,drug) =>{

    if(err) throw err;

    if(drug == null){

      let newDrug = new Drug({
          id:pid,
          name:req.body.name,
          type:age,
          added_date:new Date(),
          image : prescribed_drugs

        });

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

Drug.getDrugById(id,(err,drug) =>{

    if(err) throw err;

    if(drug){

      User.updateDrug(drug,(err, drug)=>{
        if(err){

          res.json({success:false, msg:"Failed to update the drug " ,err : err});

        } else {

          res.json({success:true, msg:"Successfully updated the drug"});

        }

      });

    }else{

      res.json({success:false, msg:"Invalid Drug"});

    }

  });



});

//Remove Drug
router.delete('/',(req,res,next)=>{


});

module.exports = router;
