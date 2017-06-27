const mongoose=require('mongoose');

const QuotationSchema=new mongoose.Schema({
  quotationid:{
     type : String,
     required : true
  },
  tenderid:{
     type: String,//mongoose.Schema.Types.ObjectId,
     //ref: 'Tender',
     required: true
  },
  supplierid:{
     type: String,//mongoose.Schema.Types.ObjectId,
    // ref: 'Supplier',
     required: true
  },
  quotation_placed_date:{
     type : Date,
     required : true
  },
  status:{  // 0-not approved, 1- approved
     type : String,
     required : true
  },
  description:{  //special things we want to mention about drugs
     type : String,
     required : true
  },
  price: {
  	type: String,
  	required: true
  }
});

const Quotation=mongoose.model('Quotation', QuotationSchema);

module.exports=Quotation;

module.exports.addQuotation=(newQuotation, callback)=>{
  newQuotation.save(callback);
};

module.exports.getAllQuotations=(callback)=>{
  Quotation.find(callback);
};

module.exports.getQuotationByID=(id, callback)=>{
  Quotation.find({"quotationid":id}, callback);
};

module.exports.updateQuotation=(id, tid, desc, price, callback)=>{
  Quotation.update({"quotationid":id}, {"tenderid":tid, "description":desc, "price":price}, callback);
};

module.exports.deleteQuotation=(id, callback)=>{
  Quotation.remove({"quotationid":id}, callback);
};
