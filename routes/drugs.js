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
    if(drugs[0]!= null){
      return res.json({success:true, drugList: drugs });
    }else{

      return res.json({success:false, msg: "No Drugs Found"});
    }
  });

});





router.post('/',(req,res,next)=>{
  let dname = req.body.dname;
  let image = req.body.image;
  let type = req.body.type;
  let date =  new Date();

  let id = "D-";
  console.log(image);
  let alteredDrugName = dname.replace(/\s/g,'');

  for(let i = 0; i < alteredDrugName.length; i++){
    if(i % 2 == 0){
      id = id + alteredDrugName[i];
    }
  }

  id = id.toUpperCase();

  Drug.getDrugsByDID(id, (err,drug)=>{
    if(err) throw err;

    if(drug){
      
      return res.status(200).json({success : false, msg:"Drug Already Exists" });
      

    }else{

      var drug = new Drug({
        id : id,
        dname : dname,
        type : type,
        added_date :date,
        image : image
      });


      Drug.addDrug(drug,(err,drug) => {
        if(err) throw err;

        if(drug){

         return res.status(200).json({success : true, drug : drug });

       }else{

        return res.status(500).json({success:false,  mgs:" No Drugs Found" });


      }
    });



    }

  });



});


// Update a drug common
router.put('/:id',(req,res,next)=>{

  let drugId = req.params.id;
  let name = req.body.dname;
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
      drug.dname = dname;
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

  let drugId = req.params.id;

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
