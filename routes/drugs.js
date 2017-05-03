const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Drug = require('../models/drug');

// Get all the drugs
router.get('/drugs',(req,res,nexr)=>{

  Drug.getAllDrugs((err,drugs) => {
    if(err) throw err;

    if(drugs){

        return res.json({success:true, userlist: drugs });
    }else{

        return res.json({success:false, msg: "No Drugs Found"});
    }
  });

});

// New Drug
router.post('/drugs',(req,res,next)=>{

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
router.put('/drugs/:id',(req,res,nexr)=>{


});

//Remove Drug
router.delete('/drugs',(req,res,nexr)=>{


});

module.exports = router;
