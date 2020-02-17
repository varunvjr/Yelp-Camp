var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");

router.get("/:id/edit",middleware.checkCampground,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("campgrounds/edit",{campground:campground});	
		}
});
});
router.delete("/:id",middleware.checkCampground,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err,res){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.render("/campgrounds");
		}
	})
})
router.put("/:id",function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updateCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var price=req.body.price;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newGround={name:name,price:price,image:image,description:desc,author:author};
	console.log(author);
	Campground.create(newGround,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			console.log(campground);
			res.redirect("/campgrounds");
		}
	})	
});
router.get("/",function(req,res){
	Campground.find({},function(err,allCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/campgrounds",{campgrounds:allCampground});
		}
	});
});
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,camp){
		if(err){
		console.log(err);
		}
		else{
			res.render("campgrounds/show",{campgrounds:camp});
			console.log(camp);
		}	
	});
});

module.exports=router;