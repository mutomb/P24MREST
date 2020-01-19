const multer = require('multer');
const path   = require('path');

var validateFile = function(file, callback ){
  allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType  = allowedFileTypes.test(file.mimetype);
  if(extension && mimeType){
    return callback(null, true);
  }else{
    callback("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
  }
}

const ImageHandler = multer({
	dest: './public/images',
	limits: {fileSize: 50000000, files: 1},
	fileFilter: (req, file, callback) => {
		validateFile(file, callback);
	}
}).single('image');

module.exports = ImageHandler;