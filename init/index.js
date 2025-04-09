const mongoose=require("mongoose");
let initdata=require("./init.js");
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
       initdata=initdata.map((obj)=>({...obj,owner:"67f38e05226e87daba4898f4"}));
       await Listing.insertMany(initdata);
       console.log("dataIntialized");
}

initDb();