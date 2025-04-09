require('dotenv').config(); // always load first
   
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
console.log(process.env.CLOUD_NAME);
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
   api_secret:process.env.CLOUD_SECRET_KEY
})
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "Roomzy",
      allowedFormats:["png","jpg","jpeg"]
      
    },
  });

  module.exports={cloudinary,storage};