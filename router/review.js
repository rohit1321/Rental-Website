const router = require('express').Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema}= require("../Schema.js")
const ExpressError = require("../utils/ExpressError.js");
const Review =require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isReviewAuthor}= require("../middleware.js");
const listingController = require("../controller/review.js")

// validate  a review Schema
const validateReview= (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
      let errMsg = error.details.map((el)=>el.message).join(",");
      if(error){
        throw ExpressError(404,errMsg);
      }else{
        next();
      }
  };

//Review Route post route
router.post("/",isLoggedIn,wrapAsync(listingController.CreateRoute));
  // Delete review  Route
  router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(listingController.DestroyReview));

  module.exports = router;
  