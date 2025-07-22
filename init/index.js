const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => console.log("Connected"));
async function main() {
  await mongoose.connect(MONGO_URL);
}

const reLinkReviews = async () => {
  const allListings = await Listing.find({});
  const allReviews = await Review.find({});

  if (allListings.length === 0 || allReviews.length === 0) {
    console.log("No listings or reviews to link.");
    return;
  }

  for (let review of allReviews) {
    const randomListing = allListings[Math.floor(Math.random() * allListings.length)];
    randomListing.reviews.push(review._id);
    await randomListing.save();
  }

  console.log("Linked existing reviews to listings.");
};

reLinkReviews();
