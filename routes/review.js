const express = require("express")
const router = express.Router({ mergeParams: true })
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {validateReview, isloggedin, isreviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/review.js")

//Post Review
router.post("/",isloggedin, validateReview, wrapAsync(reviewController.postReview));

//Delete review
router.delete("/:reviewId", isloggedin,isreviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports = router