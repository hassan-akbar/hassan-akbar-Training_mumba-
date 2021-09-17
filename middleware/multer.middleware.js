const multer = require("multer");
const path = require("path");

//Set Storage Engine for multer
const storage = multer.diskStorage({
  //destination where the images will be stored on the server
  destination: "./database/images/",
  filename: function (req, file, cb) {
    //stores the file name as current timestamp with the extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

//Init the upload variable

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    return check_file_type(req, file, cb);
  },
}).single("img_attachment");

//additional module to check filename and mimetype
function check_file_type(req, file, cb) {
  allowed_extentions = /jpeg|jpg|gif|png/;

  //checking extension type
  const ext_name = allowed_extentions.test(
    path.extname(file.originalname).toLowerCase()
  );

  //checking mimetype
  const mime_type = allowed_extentions.test(file.mimetype);

  if (ext_name && mime_type) {
    return cb(null, true);
  } else {
    cb("Error : Only images supported ");
  }
}

module.exports.upload = upload;
