const express=require("express");
const router = express.Router({ mergeParams: true });

const Review=require("../models/review.js")
const wrapAsync=require("../utils/wrapasync.js")
const ExpressError=require("../utils/ExpressError.js")
const {reviewSchema}=require("../schema.js");
//Delete Review route
const Listing=require("../models/listing.js");
const { isLoggedIn ,isAuthor} = require("../middleware.js");
const reviewController=require("../controllers/Reviewcontroller.js");
const review = require("../models/review.js");
const validateSchema=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errmsg);
    }else{
        next();
    }
}
router.delete("/:revid",isLoggedIn,isAuthor,wrapAsync (reviewController.deleteReview));

router.post("/" ,isLoggedIn,validateSchema,wrapAsync(reviewController.postReview));

module.exports=router;