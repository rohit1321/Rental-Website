const Review =require("../models/review.js");
const Listing = require("../models/listing.js");
const { model } = require("mongoose");

module.exports.CreateRoute = async(req,res)=>{
    
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    // console.log("review added  successfully")
    // res.send("review add :)")
    req.flash("success","New Review Created...!")
    res.redirect(`/listings/${listing._id}`)
  };

module.exports.DestroyReview =async(req,res)=>{
    let {id,reviewId} = req.params;
  
    await Listing.findByIdAndUpdate(id, { $pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully...!")
    res.redirect(`/listings/${id}`)
  };