"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('../config/database');

var OrderSchema = mongoose.Schema({
    orderid:{
        type : String,
        required : true
    },
    tenderid:{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Tender'
        type : String,
        required : true
    },
    quotationid:{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Quotation'
        type : String,
        required : true
    },
    supplierid:{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Supplier'
        type : String,
        required : true
    },
    placedby:{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User'
        type : String,
        required : true
    },
    order_placed_date:{
        type : Date,
        required : true
    },
    status:{  // 0-pending orders(purchased order), 1- completed sales orders
        type : String,
        required : true
    },
    order_dispatched_date:{
        type : Date,
        required : true
    },
    order_completed_date:{
        type : Date,
        required : true
    }

});

const Order = module.exports = mongoose.model('Order', OrderSchema);

// Tender Management //
module.exports.createPurchaseOrder = (newpurchaseOrder,callback) => {
    newpurchaseOrder.save(callback);
}

module.exports.removePurchaseOrder = (orderid,callback) => {
    let value = { orderid : orderid };
    Order.findOneAndRemove(value,callback);
}

module.exports.updatePurchaseOrder = (purchaseOrderUp, callback) =>{
    purchaseOrderUp.save(callback);
}
module.exports.updatePurchaseOrderStatus = (purchaseOrderUp, callback) =>{
    purchaseOrderUp.save(callback);
}
// Tender Handling //
module.exports.getPurchaseOrderById = (orderid, callback)=>{
    let value = { orderid : orderid };
    Order.findOne(value,callback);
}

module.exports.getAllPurchaseOrders=(callback)=>{
    Order.find(callback);
}

//Dinusha's things(Secret)

module.exports.getAllSalesOrders=(callback)=>{
  Order.find({"status":"1"}, callback);
};

module.exports.getSalesOrderByID=(id, callback)=>{
  Order.find({$and:[{"orderid":id}, {"status":"1"}]}, callback);
};

module.exports.updateSalesOrder=(id, status, dispatched_date, completed_date, callback)=>{
  Order.update({"orderid":id}, {"status":status, "order_dispatched_date":dispatched_date, "order_completed_date":completed_date}, callback);
};