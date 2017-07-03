const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('../config/database');


var PrescriptionSchema = mongoose.Schema({

  pid:{
    type : String,
    required : true
  },
  fullname:{
    type : String,
    required : true
  },
  age:{
    type : Number,
    required : true
  },
  created_date:{
    type : Date,
    required : true
  },
  prescribed_drugs : [{
      dname: { type: String, lowercase: true, trim: true },
      frequency: { type: String, trim: true },
      period : { type: String, trim: true}
    }],
  physician : {

     type: mongoose.Schema.Types.ObjectId,
     ref: 'Users'

  },history : [{
      drug_id : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'drugs'
      },
      dname:{type: String, trim:true},
      qty: { type: String, trim: true },
      date : { type: Date}
    }]

});

const Prescription = module.exports = mongoose.model('Prescription', PrescriptionSchema);

module.exports.addPrescription = (newPrescription, callback) =>{
      newPrescription.save(callback);
}

module.exports.getAllPresciptions = (callback) =>{
      Prescription.find(callback);
}

module.exports.getAllPresciptionsByUsername = (_id ,callback) =>{
      let query = {physician : _id };
      Prescription.find(query,callback);
}
module.exports.getPrescriptionBy_Id = (_id, callback)=>{

  let query = { _id : _id };
  Prescription.findOne(query,callback);

}

module.exports.removePrescription = (_id,callback) => {

  Prescription.findByIdAndRemove(new mongoose.mongo.ObjectID(_id),callback);

}

module.exports.updatePrescription = (updatedPrescription, callback) =>{

  updatedPrescription.save(callback);

}

//special cases
module.exports.getAllPresciptionsByPatientName = (name,callback) =>{
    let query = {fullname : /name/i };
      Prescription.find(callback);
}

module.exports.getAllPresciptionsByPID = (pid,callback) =>{
    let query = {fullname : pid };
      Prescription.find(callback);
}

module.exports.prescriptionSearch = (searchString,callback) =>{
  Prescription.find({$or : [{fullname: new RegExp(searchString, 'i')},{pid: new RegExp(searchString, 'i')}]},callback);
}
