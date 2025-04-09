const express=require("express");
const router= express.Router();
const wrapAsync=require("../utils/wrapasync.js")
const {isLoggedIn,isOwner, isAuthor}=require("../middleware.js");
const listingcontroller=require("../controllers/listingcontroller.js");

 const multer  = require('multer')
 const {storage}=require("../cloudConfig.js");
    const upload = multer({ storage })
router.route("/")
.get(wrapAsync(listingcontroller.index))
.post( isLoggedIn,upload.single('image'),wrapAsync(listingcontroller.postNewListing));


router.get("/new",isLoggedIn,listingcontroller.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingcontroller.showListing))

.put(isLoggedIn,isOwner,upload.single('image'),wrapAsync(listingcontroller.updateListing))

.delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.deleteListing));





router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.getEditForm));


module.exports=router;