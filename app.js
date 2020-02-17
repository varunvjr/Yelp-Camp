var express=require("express");
var app=express();
var flash=require("connect-flash");
app.use(flash());
var methodOverride=require("method-override");
var mongoose=require("mongoose");
var bodyParser=require('body-parser');
var passport=require("passport");
var localStrategy=require("passport-local");
// =====================mongoose schema ====================
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
// ==============================================================
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

  
// ================================================
var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true,useUnifiedTopology:true}, () => { console.log("we are connected")}).catch(err => console.log(err));
 // seedDB=require("./seed");
 // seedDB();


// Campground.create({	
// 	name:"mountrainer",				   					     			 	image:"https://pixabay.com/get/57e8d5444e5ba914f6da8c7dda793f7f1636dfe2564c704c7d2f79d2924dc459_340.jpg"	
// },function(err,campground){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log("New Campground has been added");
// 		console.log(campground);
// 	}
// });
app.use(require("express-session")({
		secret:"Cr7 the best player!!!",
		resave:false,
		saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});
// ========================================
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.listen(3000,function(){
	console.log("server started");
});