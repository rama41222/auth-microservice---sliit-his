const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('../config/database');


var CategorySchema = mongoose.Schema({

  id : {
    type : String,
    required : true

  },
  name : {
    type : String,
    required : true
  }

});

const Category = module.exports = mongoose.model('Category', CategorySchema);

module.exports.addCategory = (newCategory,callback) => {
  newCategory.save(callback);
}

module.exports.updateCategory = (updatedCategory,callback) => {

  updatedCategory.save(callback);

}
module.exports.getCategoryById = (id, callback)=>{
  let query = { id : id };
  Category.findOne(query,callback);
}

module.exports.getCategoriesByName = (name, callback)=>{

  let query = { name : name };
  Category.find(query,callback);
}

module.exports.getAllCategories = (callback) => {

  Category.find(callback);

}

module.exports.removeCategory= (_id,callback) => {

  Category.findByIdAndRemove(new mongoose.mongo.ObjectID(_id),callback);

}

module.exports.categoriesSearch = (searchString,callback) =>{

  Category.find({$or : [{id: new RegExp(searchString, 'i')},{name: new RegExp(searchString, 'i')}]},callback);
  
}

