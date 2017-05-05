const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Category = require('../models/category');

// Get all the drug Categories
router.get('/',(req,res,next)=>{

  Category.getAllCategories((err,drugCategories) => {
    if(err) throw err;

    if(drugCategories){

      return res.json({success:true, drugCategoriesList: drugCategories });
    }else{

      return res.json({success:false, msg: "No Categories Found"});
    }
  });

});

router.post('/',(req,res,next)=>{

  let catName = req.body.name;
  
  Category.getCategoriesByName(catName,(err,drugCategory) => {
    if(err) throw err;

    if(drugCategory[0] !=null ){
   
      return res.json({success:false, msg: "Category Already Exists" });

    }else{

    	let catId = "cat-";
    	let alteredCatName = catName.replace(/\s/g,'');

    	for(let i = 0; i < alteredCatName.length; i++){
    		if(i % 2 != 0){
    			catId = catId + alteredCatName[i];
    		}
    	}

    	catId = catId.toUpperCase();

    	let newCategory = new Category({
    		id : catId,
    		name : catName
    	});

      Category.addCategory(newCategory,(err, drugCategory)=>{
      	if(err) throw err;

      	if(drugCategory){

      	return res.json({success:true, msg: "Category Successfully added"});

      }else{

      	return res.json({success:false, msg: "Category Cannot be posted"});

      }

      });
      
    }
  });

});

router.put('/:catId',(req,res,next)=>{

  let catId = req.params.catId;
  let catName = req.body.name;

  Category.getCategoryById(catId,(err,drugCategory) => {
    if(err) throw err;
    console.log(drugCategory);

    if(!drugCategory){
   
      return res.json({success:false, msg: "Category not found" });

    }else{

    	let catId = "cat-";
    	let alteredCatName = catName.replace(/\s/g,'');

    	for(let i = 0; i < alteredCatName.length; i++){
    		if(i % 2 != 0){
    			catId = catId + alteredCatName[i];
    		}
    	}

    	catId = catId.toUpperCase();

    	drugCategory.id = catId;
    	drugCategory.name = catName;

      Category.updateCategory(drugCategory,(err, drugCategory)=>{
      	if(err) throw err;

      	if(drugCategory){

      	return res.json({success:true, msg: "Category Updated Successfully"});

      }else{

      	return res.json({success:false, msg: "Category Cannot be Updated"});

      }

      });
      
    }
  });

});

router.delete('/:catId',(req,res,next)=>{

  let catId = req.params.catId;

  Category.getCategoryById(catId,(err,drugCategory) => {
    if(err) throw err;
    console.log(drugCategory);

    if(!drugCategory){
   
      return res.json({success:false, msg: "Category not found" });

    }else{

    	
      let _id = drugCategory._id;

      Category.removeCategory(_id,(err, drugCategory)=>{
      	if(err) throw err;

      	if(drugCategory){

      	return res.json({success:true, msg: "Category removed Successfully"});

      }else{

      	return res.json({success:false, msg: "Category Cannot be removed"});

      }

      });
      
    }
  });

});


module.exports = router;