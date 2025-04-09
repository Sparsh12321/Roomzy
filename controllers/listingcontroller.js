const Listing=require("../models/listing.js")
const axios = require('axios');
const { model } = require("mongoose");
console.log(axios.isCancel('something'));

 // always load first
 const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mapToken = process.env.MAP_API_KEY;
async function getCoordinates(query) {
    try {
        const response = await axios.get('https://api.geocodify.com/v2/geocode', {
            params: {
                api_key: mapToken,
                q: query
            }
        });

        const coordinates = response.data.response.features[0].geometry;
        console.log(coordinates)

        // console.log("📍 Location:", place);
        // console.log("🧭 Coordinates:", coordinates); // [longitude, latitude]

        return coordinates;

    } catch (error) {
        console.error("❌ Geocode Error:", error.message);
    }
}

module.exports.index = async (req, res) => {
    const { category } = req.query;
    console.log("Category filter:", category); // Add debug logging
    
    let allListings;

    if (category) {
        // Map short filter names to actual schema category names if needed
        const categoryMapping = {
            "lake": "lakefront",
            "pool": "pools",
            "mountain": "mountains",
            "farm": "farms",
            "views": "amazing views",
            "iconic": "iconic cities"
        };
        
        // Use the mapped category if it exists, otherwise use the original
        const schemaCategory = categoryMapping[category] || category;
        
        console.log("Looking for listings with category:", schemaCategory);
        allListings = await Listing.find({ category: schemaCategory });
    } else {
        allListings = await Listing.find({});
    }
    
    console.log(`Found ${allListings.length} listings`);
    res.render("Listings/Listing.ejs", { allListings, category });
};
module.exports.renderNewForm=(req,res)=>{
    res.render("Listings/new.ejs");
    
}

module.exports.showListing=async(req,res)=>{
    let{id}=req.params;

   const showListing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
   let coordinates=await getCoordinates(showListing.location);
   
//    console.log(coordinates)
//    module.exports=coordinates;
   if(!showListing){
    req.flash("error","Listing doesnt exist");
    res.redirect("/listings");
   }
//    console.log(showListing);
   res.render("Listings/show.ejs",{showListing,coordinates});

};

module.exports.updateListing=async(req,res)=>{
let {id}=req.params;
if(req.file){
let url=req.file.path;
let filename=req.file.filename;}
let {title:title,description:description,price:price,location:location,country:country}=req.body;
await Listing.findByIdAndUpdate(id,{title:title,description:description,image:{url:url,filename:filename},price:price,location:location,country:country});

res.redirect(`/listings/${id}`);
};

module.exports.postNewListing=async(req, res) => {
    // First, check if req.body has the expected structure
    // console.log("Request body:", req.body); // Debug line to see what's coming in
    
    // Make sure to wrap the req.body if it's not already in the expected format
    const dataToValidate = req.body.listing ? req.body : { listing: req.body };

    
 let url=req.file.path;
 let filename=req.file.filename;
 console.log(url,filename);   // Validate
    
    
    // Extract data from the routerropriate location
    const listingData = req.body.listing || req.body;
    let coordinates=await getCoordinates(listingData.location);
    let sample = new Listing({
        title: listingData.title,
        description: listingData.description,
        image: {
            url: url,
            filename:filename // This field should be a string now
        },
        price: listingData.price,
        location: listingData.location,
        country: listingData.country,
        owner:req.user._id,
        geometry:{
            type:coordinates.type,
            coordinates:coordinates.coordinates

        },
        category:listingData.category
    });
    
    await sample.save();
    req.flash("success","New Listing Created")
    res.redirect("/listings");
};


module.exports.getEditForm=async(req,res)=>{
    let {id}=req.params;   
    console.log(id); 
    const ListingUp=await Listing.findById(id);
    let Listingurl=ListingUp.image.url;
    Listingurl=Listingurl.replace("/upload","/upload/c_fill,h_250/");
    console.log(Listingurl);
    if(!ListingUp){
        req.flash("error","Listing doesnt exist");
        res.redirect("/listings");
       }
       res.render("Listings/update.ejs",{ListingUp,Listingurl});
   };


   module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("delete","Listing Deleted")
    res.redirect("/listings");
};