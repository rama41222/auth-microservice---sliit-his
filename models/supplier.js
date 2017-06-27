const mongoose=require('mongoose');
//const bcrypt=require('bcrypt');

const SupplierSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  tel:{
    type:String,
    required:true
  },
  companyName:{
    type:String,
    required:true
  },
  country:{
      type:String,
      required:true
  },
  password:{
    type:String,
    required:true
  }
});

const Supplier=mongoose.model('Supplier', SupplierSchema);

module.exports=Supplier;

module.exports.generateHash=function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

module.exports.validatePassword=function(password){
  return bcrypt.compareSync(password, this.local.password);
};

module.exports.addSupplier=(newSupplier, callback)=>{
  newSupplier.save(callback);
};

//find to test addition of supplier
module.exports.getAllSuppliers=(callback)=>{
  Supplier.find(callback);
};

module.exports.getSupplierByID=(email, callback)=>{
  Supplier.find({"email":email}, callback);
};

module.exports.updateSupplier=(email, name, tel, companyName, country, password, callback)=>{
  Supplier.update({"email":email}, {"name":name, "tel":tel, "companyName":companyName, "country":country, "password":password}, callback);
};

module.exports.deleteSupplier=(email, callback)=>{
  Supplier.remove({"email":email}, callback);
};
