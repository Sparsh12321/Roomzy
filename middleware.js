const Listing=require("./models/listing.js")
const Review=require("./models/review.js")
module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.path,"  ",req.originalUrl);  
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        // console.log(req.session.redirectUrl)
        req.flash("error","You must be logged in to continue");
        return res.redirect("/login");
    
}
next();
}


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;}
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    console.log(listing.owner);
    console.log("local id",res.locals.currUser._id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        
    return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isAuthor=async(req,res,next)=>{
    let {revid,id}=req.params;
    console.log(revid),"review";
    console.log(res.locals.currUser._id);
    let review=await Review.findById(revid);
   
    console.log("local id",res.locals.currUser._id);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","Unauthorized User");
        
    return res.redirect(`/listings/${id}`);
    }
    next();
}