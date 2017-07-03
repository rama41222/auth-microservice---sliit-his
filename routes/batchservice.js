const express = require('express');
const router = express.Router();
const Batch = require('../models/batch');

const async = require('async');

router.put('/',(req,res)=>{
	var batchObj = req.body;
 
	  async.forEach(batchObj, processEachTask, afterAllTasks);

	  function processEachTask(task, callback) {
	 
		Batch.getBatchByDrugId(task._id,(err,batch)=>{
			if(err){
				res.status(404).json({error:"No batch found " + err});
			}else if(batch){
				 
			batch.quantity = batch.quantity - task.qty;
			
			Batch.updateBatch(batch,(err,newBatch)=>{
              
				if(err){
				res.status(404).json({error:"No batch found " + err});
				}else{
					callback(err);
					console.log('=======================')
					console.log(newBatch);
				}


             });


			}
			
		});

		}

	  function afterAllTasks(err) {
	    res.status(200).json({success:true});
	  }
});

module.exports =  router;