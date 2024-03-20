import { diskStorage, memoryStorage } from 'multer';

// Configure multer storage
export const multerOptions = {
  storage: diskStorage({
    destination: './uploads', // Destination directory for uploaded files
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename for each uploaded file
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB file size limit (adjust as needed)
  },
};

// https://stackoverflow.com/questions/69921812/multer-file-buffer-missing

// Configure multer storage
export const multerS3Options = {
  storage: memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB file size limit (adjust as needed)
  },
};