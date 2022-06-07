/**
 * Module imports.
 */
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

/**
 * Config import.
 */
//  const SECRETS = require("../configs/config"); 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINAY_SECRET
});

/**
 * Multer config.
 */
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'AuctionApp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = { cloudinary, storage };