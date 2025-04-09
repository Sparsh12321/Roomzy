const User=require("../models/user.js");
module.exports.signupUser=async(req,res)=>{
    try{ let{username,email,password}=req.body
     const newUser=new User({
         email:email,
         username:username
     });
     const registeredUser=await User.register(newUser,password);
     console.log(registeredUser);
     req.login(registeredUser,(err)=>{
         if(err){
             return next(err);
         }
 
         req.flash("success","User was registered successfully");
         res.redirect("/listings");
     })
 }catch(err){
     req.flash("error",err.message);
     res.redirect("/signup");
 }
 };

 module.exports.loginForm=async(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.postLogin=async(req,res)=>{
    req.flash("success","Welcome Back to Roomzy");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out now");
        res.redirect("/listings");
    })
};