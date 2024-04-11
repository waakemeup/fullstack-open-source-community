export default function checkFileType(req, file, cb) {
  // Update file name
  file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');

  cb(null, true);
}

// 防止中文乱码
// https://stackoverflow.com/questions/72909624/multer-corrupts-utf8-filename-when-uploading-files
