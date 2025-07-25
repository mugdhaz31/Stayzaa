const User = require("../models/user.js")

module.exports.rendersignupFrom = (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body
        const newUser = new User({ email, username })
        const registereduser = await User.register(newUser, password)
        console.log(registereduser)
        req.login(registereduser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success", "Welcome to Stayzaa !")
            res.redirect("/listings")
        })
    }
    catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}

module.exports.renderloginForm = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome to Stayzaa! You are logged in...")
    console.log("Redirecting to:", res.locals.redirectUrl);
    res.redirect(res.locals.redirectUrl || "/listings")
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next()
        }
        req.flash("success","Logged out successfully !")
        res.redirect("/listings")
    })
}