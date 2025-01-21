const Listing = require("./models/listing.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
      //OriginalURL save
      req.session.redirectUrl = req.originalUrl;
        req.flash("error","You Must Be Logged In to Create new Listing..!")
        res.redirect("/login")
      }
      next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async(req,res,next)=>{
  let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","You Are Not A Owner Of this Post..!");
      return res.redirect(`/listings/${id}`);
    };
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
  let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)){
      req.flash("error","You Are Not A Author Of this Review..!");
      return res.redirect(`/listings/${id}`);
    };
    next();
}