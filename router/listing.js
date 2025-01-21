const router = require('express').Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema}= require("../Schema.js")
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner}= require("../middleware.js");
const listingController = require("../controller/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage})


//Vallidate a Listing schema
const validateListing= (req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
    let errMsg = error.details.map((el)=>el.message).join(",");
    if(error){
      throw ExpressError(404,errMsg);
    }else{
      next();
    }
};

router.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn,
  upload.single("listing[image]"),
  wrapAsync(listingController.NewPost)
);

// Create New
router.get("/new", isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.put(isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync( listingController.UpdateRoute))
.get(wrapAsync(listingController.ShowRoute ))
.delete(isLoggedIn,isOwner, wrapAsync( listingController.DeleteRoute));

// Index Route
// router.get("/",wrapAsync(listingController.index));
  
  
  //Post  method for creating a new post
  // router.post(
  //   "/",isLoggedIn,
  //   wrapAsync(listingController.NewPost)
  // );
  
  // Edit from
  router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingController.EditFrom));
   
  //Update Route
  // router.put("/:id",isLoggedIn,isOwner, wrapAsync( listingController.UpdateRoute));
  
  //Show Route
  // router.get("/:id",wrapAsync(listingController.ShowRoute ));
 
  //DELETE Route
  // router.delete("/:id",isLoggedIn,isOwner, wrapAsync( listingController.DeleteRoute));


  module.exports = router;
  