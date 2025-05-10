
const multer = require("multer");

// Use memoryStorage so the file lands in req.file.buffer
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
    // Only accept images (MIME type starts with "image/")
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  }
module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 5 MB max
});