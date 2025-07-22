const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.postReview = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    const err = new Error("Listing not found");
    err.statusCode = 404;
    return next(err); 
  }
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id
  console.log(newReview)
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("new review saved");
  req.flash("success", "Your review added !!")
  res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req,res)=> {
  let {id,reviewId} = req.params
  await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId)
  req.flash("success", "Your review deleted !!")
  res.redirect(`/listings/${id}`)
}