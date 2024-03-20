import { Controller, HttpException, HttpStatus, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, ApiBody, ApiConsumes, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { RekognitionService } from './rekognition.service';
import { MulterS3File } from 'multer-s3';
import { Express } from 'express';
import * as AWS from 'aws-sdk';
import { multerOptions,multerS3Options } from './multer.config';
import * as dotenv from 'dotenv';
import { CompareFaceApiResponse, DetectFaceApiResponse } from './response-example';

// Load environment variables from .env file
dotenv.config();

@ApiTags('Rekognition') // Tag the controller with 'Rekognition' for Swagger documentation
@Controller('rekognition')
export class RekognitionController {
  constructor(private readonly rekognitionService: RekognitionService) {}

  @ApiOperation({ summary: 'Upload an image' }) // Document the uploadImage endpoint
  @Post('upload')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  // @UseInterceptors(FileExtender)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    try {
      if (!image) {
        throw new HttpException('No image uploaded', HttpStatus.BAD_REQUEST);
      }

      console.log(image);

      if (image.buffer.length === 0) {
        throw new HttpException('Uploaded file is empty', HttpStatus.BAD_REQUEST);
      }

      return { imageUrl: image.path };
    } catch (error) {
      // Handle specific errors
      if (error instanceof HttpException) {
        throw error; // Re-throw HTTP exceptions
      } else {
        // Handle other unexpected errors
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @ApiOperation({ summary: 'Upload an image to S3 Bucket' })
  @Post('upload-s3')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerS3Options))
  async uploadS3Image(@UploadedFile() image: Express.Multer.File) {
    try {
      if (!image) {
        throw new HttpException('No image uploaded', HttpStatus.BAD_REQUEST);
      }

      console.log(image);

      if (image.buffer.length === 0) {
        throw new HttpException('Uploaded file is empty', HttpStatus.BAD_REQUEST);
      }

      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
      });

      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `images/${image.originalname}`,
        Body: image.buffer, // Using image.buffer instead of image.path
        // ACL: 'public-read', // Set appropriate ACL for your use case
        ContentType: image.mimetype
      };

      const data = await s3.upload(uploadParams).promise();

      return { imageUrl: data.Location };
    } catch (error) {
      console.log(error);
      // Handle specific errors
      if (error instanceof HttpException) {
        throw error; // Re-throw HTTP exceptions
      } else {
        // Handle other unexpected errors
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @ApiOperation({ summary: 'Compare faces from two images' }) // Document the compareFaces endpoint
  @Post('compare-faces')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sourceImage: {
          type: 'string',
          format: 'binary',
        },
        targetImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: CompareFaceApiResponse })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'sourceImage', maxCount: 1 },
    { name: 'targetImage', maxCount: 1 },
  ], multerS3Options))
  // @UseInterceptors(FileInterceptor('targetImage', multerS3Options))
  async compareFaces(
    @UploadedFiles() files: { sourceImage?: Express.Multer.File[], targetImage?: Express.Multer.File[] }
  ) {
    
    console.log(files);

    const sourceImage = files['sourceImage'] ? files['sourceImage'][0] : null;
    const targetImage = files['targetImage'] ? files['targetImage'][0] : null;

    if (!sourceImage || !targetImage) {
      throw new HttpException('Please provide both source and target images', HttpStatus.BAD_REQUEST);
    }

    console.log("Insert Function"); 

    try {
      const sourceImageBuffer = (sourceImage as MulterS3File).buffer;
      const targetImageBuffer = (targetImage as MulterS3File).buffer;
      
      return this.rekognitionService.compareFaces(sourceImageBuffer, targetImageBuffer);
    } catch (error) {
      console.log(error);

      // Handle specific errors
      if (error instanceof HttpException) {
        throw error; // Re-throw HTTP exceptions
      } else {
        // Handle other unexpected errors
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @ApiOperation({ summary: 'Detect faces in an image' }) // Document the detectFaces endpoint
  @Post('detect-faces')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary'
        }
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: DetectFaceApiResponse })
  @UseInterceptors(FileInterceptor('image', multerS3Options))
  async detectFaces(@UploadedFile() image: Express.Multer.File) {
    const imageBuffer = (image as MulterS3File).buffer;
    return this.rekognitionService.detectFaces(imageBuffer);
  }
}
