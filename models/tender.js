/**
 * Created by mayac on 5/6/2017.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('../config/database');

var TenderSchema = mongoose.Schema({
    tenderid:{
        type : String,
        required : true
    },
    drug_id:{
        type : String,
        required : true
    },
    drug_name:{
        type : String,
        required : true
    },
    drug_categ:{
        type : String,
        required : true
    },
    quantity:{ // quantity we requesting for the tender
        type : Number,
        required : true
    },
    description:{  //special things we want to mention in the tender
        type : String,
        required : true
    },
    status:{  // 0-open tender , 1- closed tender
        type : Number,
        required : true
    },
    t_ex_date:{  //tender expiry date
        type : Date,
        required : true
    },
    t_added_date:{ //tender created date
        type : Date,
        required : true
    },
    placedby:{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Users'
        type : String,
        required : true
    }
});

const Tender = module.exports = mongoose.model('Tender', TenderSchema);

// Tender Management //
module.exports.createTender = (newTender,callback) => {
    newTender.save(callback);
}

module.exports.removeTender = (tenderid,callback) => {
    let value = { tenderid : tenderid };
    Tender.findOneAndRemove(value,callback);
}

module.exports.updateTender = (tenderUp, callback) =>{
    tenderUp.save(callback);
}

// Tender Handling //
module.exports.getTenderById = (tenderid, callback)=>{
    console.log(tenderid);
    let value = { tenderid : tenderid };
    Tender.findOne(value,callback);
}

module.exports.getAllTenders=(callback)=>{
    Tender.find(callback);
}