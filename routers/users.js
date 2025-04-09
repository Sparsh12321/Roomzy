const express=require("express");
const router = express.Router({ mergeParams: true });
const User=require("../models/user.js");
const asyncWrap = require("../utils/wrapasync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js")
const userController=require("../controllers/usercontroller.js");


router.route("/signup")
    .get((req,res)=>{
        res.render("./users/signup.ejs");
    })
    .post(asyncWrap (userController.signupUser));


router.route("/login")
    .get(asyncWrap(userController.loginForm))
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",
        failureFlash:true}),asyncWrap(userController.postLogin));


router.get("/logout",userController.logout);
module.exports=router;  