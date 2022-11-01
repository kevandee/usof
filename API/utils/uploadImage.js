const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 32 * 1024 * 1024,
  }
});

module.exports = upload