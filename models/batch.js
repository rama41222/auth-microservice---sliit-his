const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('../config/database');

var batchSchema=mongoose.Schema({
      batchId:{
        type:String,
        required:true
      },
      createdDate:{
        type:Date,
        required:true
      },
      quantity:{
        type:String,
        required:true
      },
     expiryDate:{
        type:Date,
        required:true
      },
     weight:{
        type:String,
        required:true
      },
     name:{
        type:String,
        required:true
      },
      drugId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'drugs'
      },
      stockId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stocks'
      }
});

const batch = module.exports = mongoose.model('batch', batchSchema);
//To pass batch
module.exports.getBatchById = (batchId, callback)=>{

  let value = { batchId : batchId };
  batch.findOne(value,callback);
}
//To add new batch to data base
module.exports.addBatch = (newBatch,callback) => {
  newBatch.save(callback);
}
//To get all batches details
module.exports.getAllBatches = (callback) => {
  batch.find(callback);
}
module.exports.deleteBatch = (batchId,callback) => {
  let value = { batchId : batchId };
  batch.findOneAndRemove(value,callback);
}
module.exports.updateBatch=(updatedBatch,callback)=>{
  updatedBatch.save(callback);
}
