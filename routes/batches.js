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
  let batchId=req.body.batchId;
  let createdDate = req.body.createdDate;
  let quantity = req.body.quantity;
  let expiryDate = req.body.expiryDate;
  let drugId = req.body.drugId;
  let stockId = req.body.stockId;
  let weight = req.body.weight;
  let name = req.body.name;
  let newBatch=new Batch({
    batchId:batchId,
    createdDate:createdDate,
    quantity:quantity,
    expiryDate:expiryDate,
    drugId:drugId,
    stockId:stockId,
    weight:weight,
    name:name
  });
  Batch.getBatchById(batchId,(err,batch)=>{
      if(err)throw err;
      if(batch==null)
      {
        Batch.addBatch(newBatch,(err,stock)=>{
            if(err)
            {
              res.json({success:false,msg:"Failed to add a batch to DB",err:err});
            }
            else{
              res.json({success:true,msg:"Successfully added to database new batch"});
            }

        });

      }
      else{
          res.json({success:false,msg:"This batch is already presented in Database.If you want you can update it"});
      }
  })
});
router.put('/:BatchId',(req,res,next)=>{
  let batchId=req.params.BatchId;
    Batch.getBatchById(batchId,(err,batch) =>{
    batch.createdDate=req.body.createdDate;
    batch.quantity=req.body.quantity;
    batch.expiryDate=req.body.expiryDate;
    //  batch.StockLevel=req.body.quantity;
      // stock.DrugID=req.body.DrugID;
        Batch.updateBatch(batch,(err,newBatch)=>{
          if(!err){
            res.json({success:true, msg:"Batch is Successfully updated"});
          } else {
            res.json({success:false, msg:"Batch is not updated" , err : err});
          }

        });
          });

});

router.delete('/:batchId',(req,res,next)=>{
let batchId=req.params.batchId;
Batch.deleteBatch(batchId,(err,batch)=>{

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
