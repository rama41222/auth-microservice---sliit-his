const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schemea

var UserSchema = mongoose.Schema({

	name:{
		type : String
	},
	email : {
		type :String,
		required : true
	},
	username : {
		type : String,
		required : true
	},
	password : {
		type : String,
		required : true
	}
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = (id, callback) =>{

	User.findById(id,callback);

}

module.exports.getUserByUsername = (username, callback) =>{
	const query = { username : username };
	User.findOne(query,callback);

}

module.exports.getUserByEmail = (email, callback) =>{
	const query = { email : email };
	User.findOne(query,callback);

}


module.exports.addUser = (newUser, callback) =>{

	bcrypt.genSalt(20,(err,salt)=>{
		bcrypt.hash(newUser.password, salt, (err, hash)=>{
			if(err){
				console.log("Error in adding user " + err);
				return;
			}
			newUser.password = hash;
			newUser.Insert(callback);
		});

	});

}

module.exports.comparePassword = (candidatePassword,hash,callback) =>{
	bcrypt.compare(candidatePassword,hash, (err,isMatch)=>{
		if(err) throw err;
		callback(null, isMatch);
	});

}
