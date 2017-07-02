const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('../config/database');

var batchSchema=mongoose.Schema({
     
      createdDate:{
        type:Date,
        required:true
      },
      quantity:{
        type:Number,
      },
     name:{
        type:String,
        required:true
      },
      drugId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'drugs'
      },
      stockId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stocks'
      }]
});

const batch = module.exports = mongoose.model('batch', batchSchema);
//To pass batch
module.exports.getBatchById = (batchId, callback)=>{

  batch.findById(batchId,callback);
}

module.exports.getBatchByName = (name, callback)=>{

  let value = { name : name };
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
  batch.findByIdAndRemove(id,callback);
}
module.exports.updateBatch=(updatedBatch,callback)=>{
  updatedBatch.save(callback);
}
