const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('../config/database');

var StockSchema = mongoose.Schema({

  StockId : {
    type : String,
    required : true
  },
  // DrugID : {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'drugs'
  // },
  TotalQuantity : {
    type : Number,
    required : true
  },
  StockLevel : {
    type : Number,
    required : true
  }

});

const Stock = module.exports = mongoose.model('Stock', StockSchema);
//To add stock details to database
module.exports.addStock = (newStock,callback) => {
  newStock.save(callback);
}
module.exports.deleteStock = (stockId,callback) => {
  let value = { StockId : stockId };
  Stock.findOneAndRemove(value,callback);

}
//to get stock details by stock id
module.exports.getStockById = (StockId, callback)=>{
  let value = { StockId : StockId };
  Stock.findOne(value,callback);
}
//To get all stock details
 module.exports.getAllStocks=(callback)=>{
      Stock.find(callback);
 }
/*//To searchstock details by stock id
 module.exports.searchedStock=(searchStockID,callback)=>{
   Stock.find({$or:[{StockId:new RegExp(searchStockID,'i')},{DrugID: new RegExp(searchStockID,'i')},{TotalQuantity: new RegExp(searchStockID,'i')},{StockLevel: new RegExp(searchStockID,'i')}]},callback);
 }
*/
 module.exports.update=(updatedStock,callback)=>{
   updatedStock.save(callback);
 }
