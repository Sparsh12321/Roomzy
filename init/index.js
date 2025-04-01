const mongoose=require("mongoose");
const initdata=require("./init.js");
const Listing=require("../models/listing.js");



main().then((res)=>{
    console.log("connection sucessful");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Roomzy");
}

const initDb=async()=>{
       await Listing.deleteMany({});
       await Listing.insertMany(initdata);
       console.log("dataIntialized");
}

initDb();