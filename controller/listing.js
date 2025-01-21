const router = require('express').Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema}= require("../Schema.js")
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner}= require("../middleware.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings });
  };


module.exports.renderNewForm =(req, res) => {
   
    res.render("new.ejs");
  };


  module.exports.NewPost =async (req, res, next) => {
    // let {title,price,lcation,counry,description} = req.body
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New listing Created..!")
    res.redirect("/listings");
  }

module.exports.EditFrom =async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested is not exist...!");
      res.redirect("/listings");
    }
    let orignalImage=listing.image.url;
    orignalImage.replace("/upload","/upload/h_250,w_250")
    res.render("edit.ejs", { listing,orignalImage });
  }

module.exports.UpdateRoute = async (req, res) => {//update Listings
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // ...req.body.listing is decontruct a parameter and access object
    
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated..!")
    res.redirect(`/listings/${id}`);
  };

  module.exports.ShowRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested is not exist...!");
      res.redirect("/listings");
    }
    res.render("show.ejs", { listing });
  };

module.exports.DeleteRoute = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted..!")
    res.redirect("/listings");
  }