const mongoose=require("mongoose");
const review=require("./review");
const { required } = require("joi");
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
    ,
    },filename:String},
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"review"
        }

    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
    ,
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
    ,
    category: {
        type: String,
        enum: ["rooms", "iconic cities", "amazing views", "beach", "lakefront", "pools", "mountains", "farms", "camping"]
    }
 


});
listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await review.deleteMany({_id:{$in:listing.reviews}});}
});

const Listing=mongoose.model("Listing",listingschema);


module.exports=Listing;