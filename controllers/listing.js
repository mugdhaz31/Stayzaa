const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
   const { category } = req.query;
  let filter = {};

  if (category) {
    filter.category = category;
  }

  const allListings = await Listing.find(filter).populate("reviews");

  for (let listing of allListings) {
    if (listing.reviews.length > 0) {
      const total = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
      listing.avgRating = (total / listing.reviews.length).toFixed(1);
    } else {
      listing.avgRating = "No ratings";
    }
  }

  res.render("listings/index.ejs", { allListings, category });

}

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("Owner");

  if (!listing) {
    req.flash("error", "Listing does not exist !")
    return res.redirect("/listings")
  }
  console.log(listing)
  let avgRating = null;
  if (listing.reviews.length > 0) {
    const total = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
    avgRating = (total / listing.reviews.length).toFixed(1);
  }

  res.render("listings/show.ejs", { listing, avgRating });
}

const fetch = require("node-fetch");

module.exports.createListing = async (req, res, next) => {
  const url = req.file?.path || '';
const filename = req.file?.filename || '';
  const { location, country } = req.body.listing;
  const fullLocation = `${location}, ${country}`;

  // Fetch coordinates from Nominatim
  const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullLocation)}`, {
  headers: {
    'User-Agent': 'WanderlustApp/1.0 (mugdha.zope123@example.com)'
  }
});

if (!geoResponse.ok) {
  console.error("Nominatim fetch error:", await geoResponse.text());
  throw new Error("Failed to fetch geolocation data");
}

const geoData = await geoResponse.json();


  const newListing = new Listing(req.body.listing);
  newListing.Owner = req.user._id;
  newListing.image = { url, filename };

  //Save coordinates if available
  if (geoData && geoData.length > 0) {
    const lat = parseFloat(geoData[0].lat);
    const lon = parseFloat(geoData[0].lon);
    newListing.geometry = {
      type: "Point",
      coordinates: [lon, lat] // Note: longitude first
    };
  } else {
    // Fallback or warning if geocoding fails
    newListing.geometry = {
      type: "Point",
      coordinates: [0, 0] 
    };
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist !")
    return res.redirect("/listings")
  }
   const originalimage = listing.image.url.replace("/upload", "/upload/h_300,w_300");
  res.render("listings/edit.ejs", { listing , originalimage});
}

module.exports.updateListing = async (req, res, next) => {
  const { id } = req.params;
  const { location, country } = req.body.listing;
  const fullLocation = `${location}, ${country}`;

  // Fetch updated geolocation from Nominatim
  const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullLocation)}`, {
    headers: {
      'User-Agent': 'WanderlustApp/1.0 (mugdha.zope123@example.com)' // update with your contact if needed
    }
  });

  let geometry = { type: "Point", coordinates: [0, 0] }; // default

  if (geoResponse.ok) {
    const geoData = await geoResponse.json();
    if (geoData && geoData.length > 0) {
      geometry.coordinates = [
        parseFloat(geoData[0].lon),
        parseFloat(geoData[0].lat)
      ];
    }
  } else {
    console.error("Nominatim fetch error:", await geoResponse.text());
  }

  // Update listing fields
  const updated = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
    geometry
  });

  // If image is updated
  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    updated.image = { url, filename };
  }

  await updated.save();

  if (!updated) {
    return res.status(404).render("error", {
      statusCode: 404,
      message: "Listing not found for update",
    });
  }

  req.flash("success", "Listing Updated !!");
  res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    return res.status(404).render("error", {
      statusCode: 404,
      message: "Listing not found to delete",
    });
  }
  req.flash("success", "Listing Deleted !!")
  res.redirect("/listings");
}
module.exports.searchListings = async (req, res) => {
  const query = req.query.q;
  const regex = new RegExp(query, 'i');

  const listings = await Listing.find({
    $or: [{ title: regex }, { location: regex },{ country: regex }]
  });

  res.render('listings/index',  { allListings: listings, category: null });
};