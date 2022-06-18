const multer = require('multer')

const AppError = require("./AppError")

const {
    storage
} = require("./cloudinaryUpload");

const upload = multer({
    limits: {
        fileSize: 5000000,
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new AppError( "Please upload an image file", 400));
        }   
        cb(undefined, true);
    },
    storage
})

module.exports = { upload };