import * as AWS from 'aws-sdk';
import { diskStorage } from 'multer';
import { S3StorageOptions } from 'multer-s3';

export const S3StorageConfig: S3StorageOptions = {
  bucket: 'your-bucket-name',
  contentType: (req, file, cb) => {
    cb(null, file.mimetype);
  },
  acl: 'public-read',
  key: (req, file, cb) => {
    const fileName = `${Date.now().toString()}-${file.originalname}`;
    cb(null, fileName);
  },
  s3: new AWS.S3(), // Initialize AWS.S3() with your AWS credentials
};
