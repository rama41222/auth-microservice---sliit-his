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

// Seach a drug
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



// Update a drug
// router.put('/:id',(req,res,next)=>{

// Drug.getDrugById(id,(err,drug) =>{

//     if(err) throw err;

//     if(drug){

//       User.updateDrug(drug,(err, drug)=>{
//         if(err){

//           res.json({success:false, msg:"Failed to update the drug " ,err : err});

//         } else {

//           res.json({success:true, msg:"Successfully updated the drug"});

//         }

//       });

//     }else{

//       res.json({success:false, msg:"Invalid Drug"});

//     }

//   });



// });

//Remove Drug
router.delete('/',(req,res,next)=>{


});

module.exports = router;
