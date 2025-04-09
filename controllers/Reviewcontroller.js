const Review=require("../models/review.js")
const Listing=require("../models/listing.js");
module.exports.deleteReview=async(req,res)=>{
    let{id,revid}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:revid}});
    await Review.findByIdAndDelete(revid);
    req.flash("delete","Review Deleted")
    res.redirect(`/listings/${id}`);

};

module.exports.postReview=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    console.log("New Review Saved");
    req.flash("success","New review Created")
    
    res.redirect(`/listings/${id}`);
    };