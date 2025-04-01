const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const Listing=require("./models/listing.js")
const engine=require("ejs-mate");
const path=require("path");
app.use(methodOverride("_method"))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); 
app.engine("ejs",engine);
app.use(express.static(path.join(__dirname,"/public")));
main().then((res)=>{
    console.log("connection sucessful");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Roomzy");
}


app.get("/listings",async(req,res)=>{
    let allListings=await Listing.find({})
    res.render("Listings/Listing.ejs",{allListings});
})

app.get("/listings/new",(req,res)=>{
    res.render("Listings/new.ejs");
    
})
app.get("/listings/:id",async(req,res)=>{
    let{id}=req.params;

   const showListing= await Listing.findById(id);
   res.render("Listings/show.ejs",{showListing});

})

app.put("/listings/:id",async(req,res)=>{
let {id}=req.params;
let {title:title,description:description,image:image,price:price,location:location,country:country}=req.body;
await Listing.findByIdAndUpdate(id,{title:title,description:description,image:{url:image},price:price,location:location,country:country});
res.redirect(`/listings/${id}`);
})
app.post("/listings",async(req,res)=>{
    let {title:title,description:description,image:image,price:price,location:location,country:country}=req.body;
let sample=new Listing({
    title:title,
    description:description,
    image:{
        url:image},
    price:price,
    location:location,
    country:country

});
await sample.save();
res.redirect("/listings");
})

app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;   
    console.log(id); 
    const ListingUp=await Listing.findById(id);
       res.render("Listings/update.ejs",{ListingUp});
   })

app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
})



// app.get("/testlisting",(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My Home",
//         description:"Calm Peaceful Place",
//         price:1200,
//         location:"Andheri West,Mumbai",
//         country:"India"
//     });
//     sampleListing.save().then((res)=>{
//         console.log(res);
//     }).catch((err)=>{
//         console.log(err);
//     })
// })
app.get("/",(req,res)=>{
    res.send("root directory");
})

app.listen(8080,()=>{
    console.log("Server is listening at",8080);
})