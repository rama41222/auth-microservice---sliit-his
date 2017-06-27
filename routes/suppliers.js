const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
//const bcrypt=require('bcrypt');

const Supplier=require('../models/supplier.js');

const Quotation=require('../models/quotation.js');

const Order=require('../models/order.js');

//register new supplier
router.post('/', (req, res, next)=>{
   //var newSupplier=new Supplier(req.body);

   //var hash=bcrypt.hashSync(req.body.password);

   //bcrypt.compareSync()

   var newSupplier=new Supplier({
      name:req.body.name,
      email:req.body.email,
      tel:req.body.tel,
      companyName:req.body.companyName,
      country:req.body.country,
      password:req.body.password
    });

    Supplier.addSupplier(newSupplier, (err, newSupplier)=>{
      if(err){
        console.error(err);
        res.sendStatus(500);
      }
      else{
        res.sendStatus(200);
      }
    })
});

//get all suppliers to test addition of supplier
router.get('/', (req, res, next)=>{
  Supplier.getAllSuppliers((err, suppliers)=>{
    res.json(suppliers);
  });
});

//update fields of a supplier
router.put('/:email', (req, res, next)=>{
  //var updatedSupplier=new Supplier(req.body);
  Supplier.updateSupplier(req.params.email, req.body.name, req.body.tel, req.body.companyName, req.body.country, req.body.password, (err, updatedSupplier)=>{
    if(err){
      console.error(err);
      res.sendStatus(500);
    }
    else{
      res.sendStatus(200);
    }
  })
});

//delete a supplier
router.delete('/:email', (req, res, next)=>{
  Supplier.deleteSupplier(req.params.email, (err, deleted)=>{
    if(err){
      console.error(err);
      res.sendStatus(500);
    }
    else{
      res.sendStatus(200);
    }
  });
});

//get supplier by email
router.get('/:email', (req, res, next)=>{
  Supplier.getSupplierByID(req.params.email, (err, supplier)=>{
    if(err){
      console.error(err);
      res.sendStatus(500);
    }
    else{
      res.json(supplier);
    }
  });
});

//get quotations of a particular supplier
router.get('/:email/quotations', (req, res, next)=>{
  Quotation.getAllQuotations((err, quotations)=>{
    if(err){
      console.error(err);
      res.sendStatus(500);
    }
    else{
      res.json(quotations);
    }
  });
});

//get quotation of a particular supplier using quotation id
router.get('/:email/quotations/:qid', (req, res, next)=>{
  Quotation.getQuotationByID(req.params.qid, (err, quotation)=>{
    if(err){
      console.error(err);
      res.sendStatus(500);
    }
    else{
      res.json(quotation);
    }
  });
});

//add quotation of a particular supplier
router.post('/:email/quotations', (req, res, next)=>{

/*  var qid;
  var exists=false;
  var collections=db.getCollectionNames();
  for(var i=0; i<collections.length; i++)
  {
      if(collections[i]=="quotations")
      {
        exists=true;
        collections[i].count(function(err, count))
        {
          if(count==0)
          {
            qid="Q000";
          }
          else
          {
            var record=db.quotations.find({}).sort("quotationid":-1).limit(1);
            var id=db.quotations.find({}, {"quotationid":1, "_id":0});

          }
        }
      }
  }

  if(exists==false)
  {
    qid="Q000";
  }  */

   var newQuotation=new Quotation({
      quotationid:req.body.quotationid,
      tenderid:req.body.tenderid,
      supplierid:req.body.supplierid,
      quotation_placed_date:Date.now(),
      status:req.body.status,
      description:req.body.description,
      price:req.body.price
    });

    Quotation.addQuotation(newQuotation, (err, newQuotation)=>{
      if(err){
        console.error(err);
        res.sendStatus(500);
      }
      else{
        res.sendStatus(200);
      }
    })
});

//update quotation of a particular supplier
router.put('/:email/quotations/:qid', (req, res, next)=>{
  Quotation.updateQuotation(req.params.qid, req.body.tenderid, req.body.description, req.body.price, (err, updatedQuotation)=>{
    if(err){
      console.error(err);
      res.sendStatus(500);
    }
    else{
      res.sendStatus(200);
    }
  })
});

//delete quotation of a particular supplier
router.delete('/:email/quotations/:qid', (req, res, next)=>{
  Quotation.deleteQuotation(req.params.qid, (err, deleted)=>{
    if(err){
      console.error(err);
      res.sendStatus(500);
    }
    else{
      res.sendStatus(200);
    }
  });
});

//add sales order
/*router.post('/:email/salesorders', (req, res, next)=>{
   var newSalesOrder=new Order({
      orderid:req.body.orderid,
      tenderid:req.body.tenderid,
      quotationid:req.body.quotationid,
      supplierid:req.body.supplierid,
      order_placed_date:Date.now(),
      status:req.body.status,
      order_dispatched_date:req.body.order_dispatched_date,
      order_completed_date:req.body.order_completed_date
    });

    Order.addSalesOrder(newSalesOrder, (err, newSalesOrder)=>{
      if(err){
        console.error(err);
        res.sendStatus(500);
      }
      else{
        res.sendStatus(200);
      }
    })
});   */

//get all sales orders of a particular supplier
router.get('/:email/salesorders', (req, res, next)=>{
  Order.getAllSalesOrders((err, salesorders)=>{
    if(err){
      console.error(err);
      res.sendStatus(500);
    }
    else{
      res.json(salesorders);
    }
  });
});

//get sales order of a particular supplier using order id
router.get('/:email/salesorders/:soid', (req, res, next)=>{
  Order.getSalesOrderByID(req.params.soid, (err, salesorder)=>{
    if(err){
      console.error(err);
      res.sendStatus(500);
    }
    else{
      res.json(salesorder);
    }
  });
});

//update sales order of a particular supplier
router.put('/:email/salesorders/:soid', (req, res, next)=>{
  Order.updateSalesOrder(req.params.soid, req.body.status, req.body.order_dispatched_date, req.body.order_completed_date, (err, updatedSalesOrder)=>{
    if(err){
      console.error(err);
      res.sendStatus(500);
    }
    else{
      res.sendStatus(200);
    }
  })
});

//delete sales order of a particular supplier
/*router.delete('/:email/salesorders/:soid', (req, res, next)=>{
  Order.deleteSalesOrder(req.params.soid, (err, deleted)=>{
    if(err){
      console.error(err);
      res.sendStatus(500);
    }
    else{
      res.sendStatus(200);
    }
  });
});  */

module.exports=router;
