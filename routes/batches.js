const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Batch = require('../models/batch');
const Stock = require('../models/stock');

router.get('/',(req,res,next)=>{

Batch.getAllBatches((err,batches)=>{

      if(err)throw err;
        if(batches){
            return res.json({success:true,batchList:batches});
        }else{
            return res.json({success:false,msg:"There is no batch added yet.Batch table is empty"});
          }
  });

});

//To get stock details by stock id
router.get('/:searchBatchID',(req,res,next)=>{
  let searchBatchID=req.params.searchBatchID;
Batch.getBatchById(searchBatchID,(err,batches)=>{

      if(err)throw err;
        if(batches){
            return res.json({success:true,batchList:batches});
        }else{
            return res.json({success:false,msg:"There is no batch in this id"});
          }
  });

});


router.post('/',(req,res,next)=>{

  let createdDate = new Date();
  let drugId = req.body.drugId;
  let name = req.body.name;


  let newBatch=new Batch({
 
    createdDate:createdDate,
    drugId:drugId,
    name:name,
    alertlevel:100
  });
  Batch.getBatchByName(name,(err,batch)=>{
      if(err)throw err;

      if(!batch)
      {
        Batch.addBatch(newBatch,(err,stock)=>{
            if(err)
            {
              res.status(500).json({success:false,msg:"Failed to add a batch to DB",err:err});
            }
            else{
              res.status(200).json({success:true,msg:"Successfully added to database new batch"});
            }

        });

      }
      else{
          res.json({success:false,msg:"This batch is already presented in Database.If you want you can update it"});
      }
  })
});
router.put('/:id',(req,res,next)=>{
    let batchId=req.params.id;

    Batch.getBatchById(batchId,(err,batch) =>{

    batch.createdDate= new Date();
    batch.quantity=req.body.quantity;
    batch.alertlevel = req.body.alertlevel;
 

        Batch.updateBatch(batch._id,(err,newBatch)=>{
          if(!err){
            res.json({success:true, msg:"Batch is Successfully updated"});
          } else {
            res.json({success:false, msg:"Batch is not updated" , err : err});
          }

        });
          });

});

router.delete('/:id',(req,res,next)=>{
let id=req.params.id;
Batch.deleteBatch(id,(err,batch)=>{

  if(err)throw err;
  if(batch){
      return res.json({success:true,msg:"Batch details deleted."})
  }
  else{
    return res.json({success:false,msg:"Batch details not deleted"});
  }
});

});

 module.exports=router;
