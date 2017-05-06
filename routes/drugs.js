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


// Update a drug common
router.put('/:id',(req,res,next)=>{

  let drugId = req.params.drugId;
  let name = req.body.name;
  let image = req.body.url;



      Drug.getDrugById(drugId,(err,drug) =>{

        if(err) throw err;

        if(drug){



          let id = "D-";

          let alteredDrugName = name.replace(/\s/g,'');

          for(let i = 0; i < alteredDrugName.length; i++){
            if(i % 2 == 0){
              id = id + alteredDrugName[i];
            }
          }

          id = id.toUpperCase();

          drug.id = id;
          drug.name = name;
          drug.added_date = new Date();
          drug.image  = image;

          Drug.updateDrug(drug,(err, drug)=>{

            if(err){

              res.json({success:false, msg:"Failed to update the drug " ,err : err});

            } else {

              res.json({success:true, msg:"Successfully updated the drug"});

            }

          });

        }else{
          res.json({success:false, msg:"Drug not Found"});

        }

      });
  
});

//Remove Drug
router.delete('/:id',(req,res,next)=>{

  let drugId = req.params.drugId;

      Drug.getDrugById(drugId,(err,drug) =>{

        if(err) throw err;

        if(drug){

          Drug.removeDrug(drug._id,(err, drug)=>{

            if(err){

              res.json({success:false, msg:"Failed to delete the drug " ,err : err});

            } else {

              res.json({success:true, msg:"Successfully deleted the drug"});

            }

          });

        }else{
          res.json({success:false, msg:"Drug not Found"});

        }

      });

});

module.exports = router;
