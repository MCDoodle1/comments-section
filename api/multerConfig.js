import multer from "multer";
import path from "path";

// Define storage for the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + path.basename(file.originalname)); // Unique file names
  },
});

// Create the multer instance with the defined storage
const upload = multer({ storage: storage });

export default upload;
