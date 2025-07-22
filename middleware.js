const Listing = require("./models/listing")
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log("Saving redirect URL:", req.originalUrl);
    req.session.redirectUrl = req.originalUrl
    req.flash("error", "You are not logged in !")
    return res.redirect("/login")
  }
  next();
}

module.exports.savedUrl = (req,res,next)=>{
  if( req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl
    delete req.session.redirectUrl;
  }
  next()
}

module.exports.isOwner = async(req,res,next) =>{
  let { id } = req.params;
    let listing = await Listing.findById(id)
    if (!listing.Owner.equals(req.user._id)) {
      req.flash("error", "You don't have permission ");
      return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(", ");
    const err = new Error(message);
    err.statusCode = 400;
    return next(err);
  }
  next();
}

module.exports.validateReview = (req, res, next) =>{
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(", ");
    const err = new Error(message);
    err.statusCode = 400;
    return next(err);
  }
  next();
}

module.exports.isreviewAuthor = async(req,res,next) =>{
  let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
      req.flash("error", "You don't have permission to delete the review as you are not the author ! ");
      return res.redirect(`/listings/${id}`);
    }
    next()
}