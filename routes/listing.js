const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js");
const {isloggedin} = require("../middleware.js")
const {isOwner} = require("../middleware.js")
const {validateListing} = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer = require("multer")
const {storage} = require("../cloudconfig.js")
const upload = multer({storage})

// Index
router.get(
  "/",
  wrapAsync(listingController.index)
);

// New Listing form
router.get("/new",isloggedin, listingController.renderNewForm);

// Search
router.get("/search", wrapAsync(listingController.searchListings));

// Display
router.get("/:id",wrapAsync(listingController.showListing)
);

//Create
router.post("/",isloggedin,upload.single("listing[image][url]"), wrapAsync(listingController.createListing)
);

// Edit
router.get(
  "/:id/edit",isloggedin, isOwner,wrapAsync(listingController.renderEditForm)
);

// Update
router.put("/:id",isloggedin,isOwner,upload.single("listing[image][url]"),  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete
router.delete("/:id",isloggedin,isOwner, wrapAsync(listingController.destroyListing)
);

module.exports = router