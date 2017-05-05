const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('../config/database');

var DrugSchema = mongoose.Schema({

  id : {
    type : String,
    required : true

  },
  name : {
    type : String,
    required : true

  },
  type : {
    type : String,
    required : true

  },
  added_date : {
    type : Date,
    required : true
  },
  image : {
    type : String,
    required : true
  }

});

const Drug = module.exports = mongoose.model('Drug', DrugSchema);

module.exports.addDrug = (newDrug,callback) => {
  newDrug.save(callback);
}

module.exports.updateDrugs = (updatedDrug,callback) => {

  updatedDrug.save(callback);

}
module.exports.updateDrugs = (updatedDrug,callback) => {

  updatedDrug.save(callback);

}
module.exports.getDrugById = (id, callback)=>{

  let query = { id : id };
  Drug.findOne(query,callback);

}

module.exports.getDrugsByName = (name, callback)=>{

  let query = { name : name };
  Drug.find(query,callback);
}

module.exports.getAllDrugs = (callback) => {

  Drug.find(callback);

}

module.exports.removeDrug = (id,callback) => {

  Drug.findOneAndRemove(id,callback);

}

module.exports.drugsSearch = (searchString,callback) =>{
  User.find({$or : [{id: new RegExp(searchString, 'i')},{name: new RegExp(searchString, 'i')},{type: new RegExp(searchString, 'i')},{added_date: new RegExp(searchString, 'i')}]},callback);
}