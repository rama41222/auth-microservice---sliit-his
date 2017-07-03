const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Batch = require('../models/batch');
const Stock = require('../models/stock');
const Drug = require('../models/drug');

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

router.get('/quantity/:did',(req,res,next)=>{

    let drugId = req.params.did;
    console.log(drugId);
      Batch.getBatchByDrugId(drugId,(err,batch)=>{
        if(err)throw err;

        if(batch)
        {

          res.status(200).json({success:true,qty : batch.quantity});
        }
        else{
          res.status(500).json({success:false,msg:"Stocks not found"});
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

  Drug.getDrugById(drugId,(err,drug)=>{
    if(err)throw err;
    console.log(drug)
    if(drug){

      Batch.getBatchByDrugId(drugId,(err,batch)=>{
        if(err)throw err;

        if(!batch)
        {

          let newBatch=new Batch({
            createdDate:createdDate,
            drugId:drugId,
            name:name,
            quantity:0,
            alertlevel:100
          });

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
          res.json({success:false,msg:"Only one batch is allowes for one drug currently "});
        }
      });



    }else{
     res.status(500).json({success:false,msg:"Invalid Drug ID"});
   }

 });

});
router.put('/:id',(req,res,next)=>{
  let batchId=req.params.id;

   Batch.getBatchById(batchId,(err,batch) =>{

    batch.createdDate= new Date();
    batch.quantity=req.body.quantity + batch.quantity;
    batch.alertlevel = req.body.alertlevel;
    batch.stockId.push(req.body.stockId);

    console.log(batch);

    Batch.updateBatch(batch,(err,newBatch)=>{
      if(err){
        console.log(err)
        res.status(500).json({success:false, msg:"Batch is not updated" , err : err});
      } else {
       res.status(200).json({success:true, msg:"Batch is Successfully updated"});

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
