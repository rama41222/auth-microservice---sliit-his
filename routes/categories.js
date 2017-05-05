const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Category = require('../models/category');
const Drug = require('../models/drug');


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

//Create a new Category
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

// Update an exsiting category
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

//Delete an exisitng category
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

//Drugs Handling

// Get all drugs belong to a specific category
router.get('/:catId/',(req,res,next)=>{

	let catId = req.params.catId;

	Category.getCategoryById(catId,(err,category) => {
		if(err) throw err;

		if(category){

			let cat_Id = category._id;

			Drug.getAllDrugsByCategory_Id(cat_Id, (err, drugs)=>{

				if(drugs[0] != null){

					return res.json({success:true, drugList: drugs });

				}else{

					return res.json({success:false, msg: "No Drugs Found"});
				}
			});

		}else{

			return res.json({success:false, msg: "No Categories Found"});
		}
	});

});
//Add a new Drug
router.post('/:catId/',(req,res,next)=>{

	let catId = req.params.catId;
	let name = req.body.name;
	let image = req.body.url;


	Category.getCategoryById(catId,(err,category) => {
		if(err) throw err;

		if(category){


			let cat_Id = category._id;

			let id = "D-";

			let alteredDrugName = name.replace(/\s/g,'');

			for(let i = 0; i < alteredDrugName.length; i++){
				if(i % 2 == 0){
					id = id + alteredDrugName[i];
				}
			}

			id = id.toUpperCase();


			Drug.getDrugById(id,(err,drug) =>{

				if(err) throw err;

				if(!drug){


					let newDrug = new Drug({
						id: id,
						name:name,
						type:cat_Id,
						added_date:new Date(),
						image : image

					});

					Drug.addDrug(newDrug,(err, drug)=>{

						if(err){

							res.json({success:false, msg:"Failed to register the drug " ,err : err});

						} else {

							res.json({success:true, msg:"Successfully added the drug to the database"});

						}

					});

				}else{
					res.json({success:false, msg:"This Drug is Already present in the database"});

				}

			});

		}else{

			return res.json({success:false, msg: "Categort Not Found"});
		}
	});

});

//Update a Drug belog to a certain category
router.put('/:catId/:drugId',(req,res,next)=>{

	let catId = req.params.catId;
	let drugId = req.params.drugId;
	let name = req.body.name;
	let image = req.body.url;


	Category.getCategoryById(catId,(err,category) => {
		if(err) throw err;

		if(category){
			let cat_Id = category._id;

			Drug.getDrugById(drugId,(err,drug) =>{

				if(err) throw err;

				if(drug){



					let id = "D-";

					let alteredDrugName = name.replace(/\s/g,'');

					for(let i = 0; i < alteredDrugName.length; i++){
						if(i % 2 == 0){
							id = id + alteredDrugName[i];
						}
					}

					id = id.toUpperCase();

					drug.id = id;
					drug.name = name;
					drug.type = cat_Id ; 
					drug.added_date = new Date();
					drug.image  = image;

					Drug.updateDrug(drug,(err, drug)=>{

						if(err){

							res.json({success:false, msg:"Failed to update the drug " ,err : err});

						} else {

							res.json({success:true, msg:"Successfully updated the drug"});

						}

					});

				}else{
					res.json({success:false, msg:"Drug not Found"});

				}

			});

		}else{

			return res.json({success:false, msg: "Categort Not Found"});
		}
	});
});


module.exports = router;