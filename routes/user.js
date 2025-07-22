const express = require("express")
const router = express.Router({ mergeParams: true })
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {savedUrl} = require("../middleware.js")
const userController = require("../controllers/user.js")

router.get("/signup", userController.rendersignupFrom)
router.post("/signup", wrapAsync(userController.signup))

router.get("/login",userController.renderloginForm)

router.post("/login",savedUrl,passport.authenticate("local",{failureRedirect:'/login' , failureFlash:true,}),userController.login)

router.get("/logout",userController.logout)

module.exports = router;