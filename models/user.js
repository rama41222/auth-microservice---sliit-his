const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schemea

var UserSchema = mongoose.Schema({

  fullname:{
    type : String,
    required : true
  },
  surname:{
    type : String,
    required : true
  },
  dob:{
    type : Date,
    required : true
  },
  doj : {
    type :Date,
    required : true
  },
  sex : {
    type :String,
    required : true
  },
  marital_status : {
    type :String,
    required : true
  },
  nationality : {
    type :String,
    required : true
  },
  blood_group : {
    type :String,
    required : true
  },
  contact : {

    type: Array
  },
  address : {

    type: Array
  },
  position : {
    type : String,
    requried : true
  },
  auth_level : {
    type : String,
    requried : true
  },
  username : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = (id, callback) =>{

  User.findById(id,callback);

}

module.exports.getUserByUsername = (username, callback) =>{
  let query = { username : username };
  User.findOne(query,callback);

}

module.exports.getUserByEmail = (email, callback) =>{
  let query = { email : email };
  User.findOne(query,callback);

}

module.exports.addUser = (newUser, callback) =>{

  bcrypt.genSalt(1,(err,salt)=>{

    if(err) throw err

    bcrypt.hash(newUser.password, salt, (err, hash)=>{

      if(err){
        console.log("Error in adding user " + err);
        return;
      }
      newUser.password = hash;
      newUser.save(callback);
    });

  });

}
module.exports.removeUser = (id,callback) => {
  //let query = { _id : };
  console.log(id);
  
  User.findByIdAndRemove(new mongoose.mongo.ObjectID(id),callback);

}
module.exports.getAllUsers = (callback) => {

  User.find(callback);

}
module.exports.updateUser = (updatedUser, callback) =>{

  updatedUser.save(callback);

}

module.exports.isDoctor = (username, callback) =>{
  let query = { username : username};
  updatedUser.findOne(query,callback);

}

module.exports.comparePassword = (candidatePassword,hash,callback) =>{
  bcrypt.compare(candidatePassword,hash, (err,isMatch)=>{
    if(err) throw err;
    callback(null, isMatch);
  });

}

module.exports.usersSearch = (searchString,callback) =>{
  User.find({$or : [{fullname: new RegExp(searchString, 'i')},{surname: new RegExp(searchString, 'i')},{sex: new RegExp(searchString, 'i')},{blood_group: new RegExp(searchString, 'i')},{username: new RegExp(searchString, 'i')},{position: new RegExp(searchString, 'i')},{email: new RegExp(searchString, 'i')}]},callback);
}
