/**
 * Module imports.
 */
 const cloudinary = require('cloudinary').v2;
 const { CloudinaryStorage } = require('multer-storage-cloudinary');
 
 /**
  * Config import.
  */
 const SECRETS = require("../configs/config"); 
 
 cloudinary.config({
     cloud_name: SECRETS.CLOUDINARY_CLOUD_NAME,
     api_key: SECRETS.CLOUDINARY_KEY,
     api_secret: SECRETS.CLOUDINAY_SECRET
 });
 
 const storage = new CloudinaryStorage({
     cloudinary,
     params: {
         folder: 'AuctionApp',
         allowedFormats: ['jped', 'png', 'jpg']
     }
 });
 
 module.exports = { cloudinary, storage };