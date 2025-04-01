const mongoose=require("mongoose");

const Schema=mongoose.Schema;
const listingschema=new Schema({
    title:{
        type:String,
    required:true},
    description:String,


    image:{
        url:
    {type:String,
        default:"https://media.istockphoto.com/id/474185479/photo/barbados.jpg?s=612x612&w=0&k=20&c=CoMAIsVOAPd6IzyrigoQdTn6POtp-OSnMv0cS9AzBzc=",
     set: (v)=> v===""?"https://media.istockphoto.com/id/474185479/photo/barbados.jpg?s=612x612&w=0&k=20&c=CoMAIsVOAPd6IzyrigoQdTn6POtp-OSnMv0cS9AzBzc=":v
    }},
    price:Number,
    location:String,
    country:String
});

const Listing=mongoose.model("Listing",listingschema);

module.exports=Listing;